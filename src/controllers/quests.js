require('../models/photo');
require('../models/user');
const Quest = require('../models/quest');
const toObjectId = require('mongoose').Types.ObjectId;
const router = require('express').Router;
const parseQuery = require('./query-parser');
const app = router();

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

app.get('/', (req, res) => {
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
});

app.get('/my', (req, res) => {
    let query = req.query;
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
            return quest.progress < 100 && quest.whoAmI === 1;
        }
        if (query.finished === '') {
            return quest.progress === 100 && quest.whoAmI === 1;
        }
        if (query.created === '') {
            return quest.whoAmI === 0;
        }

        return true;
    });
    let questIds = quests.map(quest => toObjectId(quest.questId));
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
});

module.exports = app;
