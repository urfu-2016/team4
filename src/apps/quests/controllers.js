require('../../models/photo');
require('../../models/user');
const Quest = require('../../models/quest');
const toObjectId = require('mongoose').Types.ObjectId;
const parseQuery = require('../../tools/query-parser');
const getUser = require('../profile/controllers').getUser;

/**
 * callback функция сортировки моделей по populate field
 *
 * @param data - data.options.sort, где data - резултьтат работы query-parser
 * @param populateName - имя populate field
 * @param a - экземпляр 1
 * @param b - экземпляр 2
 * @returns {*}
 */
function sortPopulated(data, populateName, a, b) {
    a = a[populateName];
    b = b[populateName];
    const keys = Object.keys(data);
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        let key = keys[keyIndex];
        if (a[key] > b[key]) {
            return -1 * data[key];
        } else if (a[key] < b[key]) {
            return data[key];
        }
    }

    return 0;
}

function isAuthor(quest, user) {
    if (quest.author._id) {
        return Boolean(quest.author._id.equals(user._id));
    }

    return Boolean(quest.author.equals(user._id));
}

exports.questsCtrl = (req, res) => {
    let query = req.query;
    let render = query.render;
    delete query.render;
    const parsedQuery = parseQuery(query);
    let questData = parsedQuery.Quest || {find: {}, options: {}};
    let authorData = parsedQuery.Author || {find: {}, options: {}};
    questData.find.isPublished = 1;
    Quest.find(
        questData.find,
        ['title', 'photos', 'description,', '_id', 'id', 'likesCount', 'rating', 'author'],
        questData.options
    )
        .populate({
            path: 'author',
            select: '-_id id name',
            match: authorData.find
        })
        .populate('photos', '-_id url')
        .exec()
        .then(data => {
            /*
             * при матчинге populate field он не исключает из списка не подходящие, а заменяет на null
             */
            data = data.filter(instance => {
                return instance.author !== null;
            });
            /*
             * сортировка к populate fields не применяется
             */
            if (authorData.options.sort) {
                data.sort(sortPopulated.bind(null, authorData.options.sort, 'author'));
            }
            data = data.map(quest => {
                return quest.wrapForUser(req.user);
            });
            if (render === '') {
                res.render('quest-list', {
                    quests: data,
                    layout: false
                });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.send('wrong parameters.' + err);
        });
};

exports.myQuestsCtrl = (req, res) => {
    let query = req.query;
    if (!Object.keys(query).length) {
        res.render('my-quests-page');

        return;
    }
    let render = query.render;
    if (!req.user) {
        if (render === '') {
            res.send('Вы не авторизованы');
        } else {
            res.send([]);
        }

        return;
    }
    let quests = req.user.quests.filter(quest => {
        if (query.active === '') {
            return quest.progress < 100 && !quest.isAuthor;
        }
        if (query.finished === '') {
            return quest.progress === 100 && !quest.isAuthor;
        }
        if (query.created === '') {
            return quest.isAuthor;
        }

        return true;
    });
    let questIds = quests.map(quest => toObjectId(quest.quest));
    Quest.find({_id: {$in: questIds}},
        ['title', 'photos', 'description,', '_id', 'id', 'likesCount', 'rating', 'author'])
        .populate({
            path: 'author',
            select: '-_id id name'
        })
        .populate('photos', '-_id url')
        .exec()
        .then(data => {
            data = data.map(quest => {
                return quest.wrapForUser(req.user);
            });
            if (render === '') {
                res.render('quest-list', {
                    quests: data,
                    layout: false
                });
            } else {
                res.send(data);
            }
        });
};

exports.questCtrl = (req, res) => {
    let questId = req.params.id;
    Quest.findOne({id: questId})
        .populate('photos', 'url')
        .populate('author', 'name id')
        .exec((err, quest) => {
            if (err || !quest) {
                res.status(404);

                return res.render('page-404');
            }
            let context = {
                quest: quest,
                checkedPhotos: [],
                iAmAuthor: false
            };

            if (!quest.isPublished) {
                if (req.user && isAuthor(quest, req.user)) {
                    return res.redirect('/quest/' + quest.id + '/edit');
                }
                res.status(404);

                return res.render('page-404');
            }
            if (req.user) {
                if (isAuthor(quest, req.user)) {
                    context.iAmAuthor = true;
                }
                getUser(req.user.id)
                    .exec((err, user) => {
                        if (err || !user) {
                            return res.send('полльзователь с таким id не найден');
                        }

                        context.checkedPhotos = user.quests.reduce((acc, el) => {
                            if (el.quest._id.equals(quest._id)) {
                                return acc.concat(el.checkPhotos);
                            }

                            return acc;
                        }, [])
                            .map(photoId => {
                                return quest.photos
                                    .findIndex(questPhoto => {
                                        return photoId.equals(questPhoto._id);
                                    });
                            });
                        res.render('quest-description-page', context);
                    });
            } else {
                res.render('quest-description-page', context);
            }
        });
};

function setPhotoChecked(user, quest, photo) {
    return new Promise((resolve, reject) => {
        let questIndex = user.quests.findIndex(userQuest => {
            return userQuest.quest._id.equals(quest._id);
        });

        if (questIndex === -1) {
            user.quests.push({
                quest: quest,
                progress: Math.round(100 / quest.photos.length),
                checkPhotos: [photo],
                isAuthor: 0
            });
        } else {
            let userQuest = user.quests[questIndex];
            let photoCount = userQuest.checkPhotos.length + 1;
            userQuest.progress = Math.round(photoCount * 100 / quest.photos.length);
            userQuest.checkPhotos.push(photo);
        }

        return user.save(err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

exports.questCheckPhotoCtrl = (req, res) => {
    let index = req.params.index;
    Quest.findOne({id: req.params.id})
        .populate('photos', 'url geoPosition')
        .exec((err, quest) => {
            if (err || !quest || index >= quest.photos.length) {
                console.error(err);
                res.status(404);

                return res.render('page-404');
            }
            if (isAuthor(quest, req.user)) {
                return res.sendStatus(400);
            }
            let photo = quest.photos[index];
            let position = quest.photos[index].geoPosition;
            if (Math.round(position.lat * 1000) !== Math.round(req.body.lat * 1000) ||
                Math.round(position.lng * 1000) !== Math.round(req.body.lng * 1000)) {
                return res.sendStatus(400);
            }

            getUser(req.user.id)
                .exec((err, user) => {
                    if (err || !user) {
                        console.error(err);

                        return req.sendStatus(500);
                    }
                    setPhotoChecked(user, quest, photo)
                        .then(() => {
                            res.sendStatus(200);
                        })
                        .catch(err => {
                            console.error(err);
                            res.sendStatus(500);
                        });
                });
        });
};

exports.newQuestCtrl = (req, res) => {
    res.render('create-quest-page', {
        photos: []
    });
};

exports.newQuestPostCtrl = (req, res) => {
    console.log(req.body);
    res.render('create-quest-page', {
        photos: []
    });
};

exports.questEdit = (req, res) => {
    res.sendStatus(404);
};
