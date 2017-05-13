require('../../models/photo');
require('../../models/user');
const Quest = require('../../models/quest');
const Photo = require('../../models/photo');
const toObjectId = require('mongoose').Types.ObjectId;
const parseQuery = require('../../tools/query-parser');
const getUser = require('../profile/controllers').getUser;
const cacheTools = require('../../tools/cache-tools');
const getCacheKey = cacheTools.getCacheKey;
const photoTools = require('../../tools/photo-tools');
const wrapForUser = require('../../tools/quest-tools').wrapForUser;
let intel = require('intel');
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

function getUserQuestIndex(quest, user) {
    return user.quests.findIndex(userQuest => {
        return userQuest.quest._id.equals(quest._id);
    });
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
                return wrapForUser(quest, req.user);
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
            intel.log('Неверные параметры ' + err);

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
    let cachePrefix = 'my-quests-';
    if (query.active === '') {
        cachePrefix += 'active';
    }
    if (query.finished === '') {
        cachePrefix += 'finished';
    }
    if (query.created === '') {
        cachePrefix += 'created';
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
        .cache(0, getCacheKey(cachePrefix, req.user))
        .lean()
        .exec()
        .then(data => {
            data = data.map(quest => {
                return wrapForUser(quest, req.user);
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
        .populate('photos', 'url geoPosition')
        .populate('author', 'name id')
        .cache(0, getCacheKey('quest-' + questId))
        .lean()
        .exec((err, quest) => {
            if (err || !quest) {
                res.status(404);

                return res.render('page-404');
            }
            let context = {
                quest: quest,
                checkedPhotos: [],
                iAmAuthor: false,
                iAmParticipant: false
            };

            if (!quest.isPublished) {
                if (req.user && isAuthor(quest, req.user)) {
                    return res.redirect('/quests/' + quest.id + '/edit');
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
                            intel.log(req.user.email + ' Пользователь не найден');

                            return res.send('Пользователь с таким id не найден');
                        }
                        if (getUserQuestIndex(quest, user) !== -1) {
                            context.iAmParticipant = true;
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
        let questIndex = getUserQuestIndex(quest, user);

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
            let progress = Math.round(photoCount * 100 / quest.photos.length);
            if (progress === 1) {
                cacheTools.clearCache('my-quests-finished', user);
                cacheTools.clearCache('my-quests-active', user);
            }
            userQuest.progress = progress;
            userQuest.checkPhotos.push(photo);
        }

        return user.save(err => {
            if (err) {
                reject(err);
            }
            cacheTools.clearCache('user', user);
            resolve();
        });
    });
}

exports.questCheckPhotoCtrl = (req, res) => {
    let index = req.params.index;
    Quest.findOne({id: req.params.id})
        .populate('photos', 'url geoPosition')
        .cache(0, getCacheKey('quest-' + req.params.id))
        .lean()
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

            getUser(req.user.id, false)
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

function applyQuestData(quest, user, post, done) {
    if (!isAuthor(quest, user)) {
        return done('Вы не автор');
    }
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
                url: post[prefix + '-photo']

            });
        }
        photo.geoPosition = {
            lat: latlng[0],
            lng: latlng[1]
        };
        if (i - deletedCount < quest.photos.length) {
            // если фотка уже была добавлена
            if (post[prefix + '-deleted']) {
                quest.photos.splice(i - deletedCount++, 1);
                photosToDelete.push(photo);
            }
        } else if (post[prefix + '-deleted']) {
            photosToDelete.push(photo);
        } else {
            photos.push(photo);
        }
    }

    if (post.publish) {
        quest.isPublished = 1;
    }

    photoTools.deletePhotos(photosToDelete, err => {
        if (err) {
            return done(err);
        }
        quest.photos = quest.photos.concat(photos);
        photoTools.savePhotos(quest.photos, err => {
            if (err) {
                return done(err);
            }
            quest.title = post['quest-title'];
            quest.description = post['quest-description'];
            quest.save(err => {
                if (err) {
                    return done(err);
                }
                cacheTools.clearCache('my-quests-created', user);
                cacheTools.clearCache('quest-' + quest.id);

                return done();
            });
        });
    });
}

exports.newQuestPostCtrl = (req, res) => {
    let post = req.body;
    let quest = new Quest({
        rating: 0,
        likesCount: 0,
        author: req.user,
        photos: [],
        isPublished: 0
    });
    applyQuestData(quest, req.user, post, err => {
        if (err) {
            console.error(err);

            return res.sendStatus(500);
        }
        getUser(req.user.id, false)
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
                    cacheTools.clearCache('user', user);

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

            applyQuestData(quest, req.user, post, err => {
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
        .populate('photos', 'url geoPosition')
        .cache(0, getCacheKey('quest-' + req.params.id))
        .lean()
        .exec((err, quest) => {
            if (err || !quest) {
                console.error(err, quest);
                res.status(404);

                return res.render('page-404');
            }

            if (quest.isPublished) {
                return res.redirect('/quests/' + quest.id);
            }

            return res.render('create-quest-page', {
                photos: quest.photos,
                quest: quest
            });
        });
};

exports.questParticipate = (req, res) => {
    Quest.findOne({id: req.params.id})
        .populate('photos', 'url geoPosition')
        .cache(0, getCacheKey('quest-' + req.params.id))
        .lean()
        .exec((err, quest) => {
            if (err || !quest || isAuthor(quest, req.user)) {
                return res.sendStatus(500);
            }
            getUser(req.user.id, false)
                .exec((err, user) => {
                    if (err || !user) {
                        console.error(err);

                        return req.sendStatus(500);
                    }
                    let questIndex = getUserQuestIndex(quest, user);

                    if (questIndex === -1) {
                        user.quests.push({
                            quest: quest,
                            progress: 0,
                            checkPhotos: [],
                            isAuthor: 0
                        });
                    }

                    return user.save(err => {
                        if (err) {
                            return res.sendStatus(500);
                        }
                        cacheTools.clearCache('user', user);
                        cacheTools.clearCache('my-quests-active', user);
                        cacheTools.clearCache('my-quests-finished', user);

                        return res.redirect('/quests/my');
                    });
                });
        });
};
