require('../../models/photo');
require('../../models/user');
const Quest = require('../../models/quest');
const Photo = require('../../models/photo');
const toObjectId = require('mongoose').Types.ObjectId;
const parseQuery = require('../../tools/query-parser');
const getUser = require('../profile/controllers').getUser;
const photoTools = require('../../tools/photo-tools');

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
        ['title', 'photos', 'description,', '_id', 'id', 'likesCount', 'rating', 'author', 'isPublished'],
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
    Quest.find({_id: {$in: questIds}})
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
                if (req.user && quest.author._id.equals(req.user._id)) {
                    return res.redirect('/quests/' + quest.id + '/edit');
                }
                res.status(404);

                return res.render('page-404');
            }
            if (req.user) {
                if (quest.author._id.equals(req.user._id)) {
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

exports.questCheckPhotoCtrl = (req, res) => {
    let index = req.params.index;
    Quest.findOne({id: req.params.id})
        .populate('photos', 'url geoPosition')
        .exec((err, quest) => {
            if (err || !quest || index >= quest.photos.length) {
                res.status(404);

                return res.render('page-404');
            }
            let position = quest.photos[index].geoPosition;
            console.log(position);
            // установить юзеру сооответствующие поля и проверить локацию
            res.sendStatus(200);
        });
};

exports.newQuestCtrl = (req, res) => {
    res.render('create-quest-page', {
        photos: []
    });
};

function savePhotos(photos, done) {
    let count = 0;
    if (!photos.length) {
        done();
    }
    photos.forEach(photo => {
        photo.save(err => {
            count++;
            if (err) {
                done(err);
            }

            if (count === photos.length) {
                done();
            }
        });
    });
}

function applyQuestData(quest, post, done) {
    let photos = [];
    let deletedCount = 0;
    let photosToDelete = [];
    if (!post['quest-title']) {
        return done('title error');
    }
    for (let i = 0; i < parseInt(post['photo-count']); i++) {
        let prefix = 'photo-block-' + i;

        if (!post[prefix + '-edited']) {
            // ничего не делали с изображением
            continue;
        }

        let latlng = post[prefix + '-location'].split(', ').map(strCoord => {
            return Number(strCoord);
        });

        if (latlng.length !== 2) {
            return done(new Error('lat lng not formatted'));
        }

        let photo;
        if (i - deletedCount < quest.photos.length) {
            photo = quest.photos[i - deletedCount];
        } else {
            photo = new Photo({
                url: post[prefix + '-photo'],
                geoPosition: {
                    lat: latlng[0],
                    lng: latlng[1]
                }
            });
        }

        if (post[prefix + '-deleted']) {
            if (i - deletedCount < quest.photos.length) {
                // удалили сохранненую фотку
                quest.photos.splice(i - deletedCount++, 1);
            }
            photosToDelete.push(photo);
            // удаляем из cloudinary все загруженные фотки
        } else {
            // добавили новую
            photos.push(photo);
        }
    }

    if (post.publish) {
        quest.isPublished = 1;
    }

    photoTools.deletePhotos(photosToDelete, err => {
        if (err) {
            done(err);
        }
        savePhotos(photos, err => {
            if (err) {
                done(err);
            }
            quest.photos = quest.photos.concat(photos);
            quest.save(err => {
                if (err) {
                    done(err);
                }
                done();
            });
        });
    });
}

exports.newQuestPostCtrl = (req, res) => {
    let post = req.body;
    let quest = new Quest({
        title: post['quest-title'],
        description: post['quest-description'],
        rating: 0,
        likesCount: 0,
        author: req.user,
        photos: [],
        isPublished: 0
    });
    applyQuestData(quest, post, err => {
        if (err) {
            console.error(err);

            return res.sendStatus(500);
        }
        getUser(req.user.id)
            .exec((err, user) => {
                if (err || !user) {
                    console.error(err, user);

                    return res.sendStatus(500);
                }

                user.quests.push({
                    quest: quest,
                    isAuthor: 1
                });

                user.save(err => {
                    if (err) {
                        console.error(err);

                        return res.sendStatus(500);
                    }

                    return res.redirect('/quests/' + quest.id + '/edit');
                });
            });
    });
};

exports.editQuestPostCtrl = (req, res) => {
    let post = req.body;
    Quest.findOne({id: req.params.id})
        .populate('photos', 'url')
        .exec((err, quest) => {
            if (err || !quest) {
                console.error(err, quest);

                return res.sendStatus(500);
            }

            applyQuestData(quest, post, err => {
                if (err) {
                    console.error(err);

                    return res.sendStatus(500);
                }

                if (quest.isPublished) {
                    return res.redirect('/quests/' + quest.id);
                }

                return res.redirect('/quests/' + quest.id + '/edit');
            });
        });
};

exports.questEdit = (req, res) => {
    Quest.findOne({id: req.params.id})
        .populate('photos', 'url')
        .exec((err, quest) => {
            if (err || !quest) {
                console.log(err, quest);
                res.status(404);

                return res.render('page-404');
            }

            if (quest.isPublished) {
                return res.redirect('/quests/' + quest.id);
            }

            return res.render('create-quest-page', {
                photos: quest.photos.map(photo => photo.url),
                quest: quest
            });
        });
};
