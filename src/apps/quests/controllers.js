require('../../models/photo');
require('../../models/user');
const Quest = require('../../models/quest');
const User = require('../../models/user');
const toObjectId = require('mongoose').Types.ObjectId;
const parseQuery = require('../../tools/query-parser');

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
    let buttonText = 'Начать квест';
    let requirementAuthorization = '';
    if (!req.user) {
        requirementAuthorization = 'Вы должны авторизоваться, чтобы участвовать в квестах.';
    }
    Quest.findOne({id: questId})
        .populate('photos', '-_id url')
        .exec((err, quest) => {
            if (req.user) {
                User.findOne({id: req.user.id})
                    .exec((err, user) => {
                        if (err || !user) {
                            return res.send('полльзователь с таким id не найден');
                        }
                        user.quests.forEach(userQuest => {
                            if (userQuest.id === quest.id) {
                                buttonText = 'Продолжить квест';
                            }
                        });
                    });
            }
            if (err || !quest) {
                return res.send('quest number was not found');
            }
            res.render('quest-description-page', {
                title: quest.title,
                description: quest.description,
                photos: quest.photos,
                requirementAuthorization: requirementAuthorization,
                buttonText: buttonText
            });
        });
};

exports.questDetailsCtrl = (req, res) => {
    let requirementAuthorization = '';
    let description = 'Здесь вы можете сверить своё местоположение с тем, что изображено на картинке';
    if (!req.user) {
        requirementAuthorization = 'Вы должны авторизоваться, чтобы участвовать в квестах.';
        description = '';
    }
    let questId = req.params.id;
    Quest.findOne({id: questId})
        .populate('photos', '-_id url')
        .exec((err, quest) => {
            if (err || !quest) {
                return res.send('quest number was not found');
            }
            res.render('photos-page', {
                title: quest.title,
                photos: quest.photos,
                requirementAuthorization: requirementAuthorization,
                description: description
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
