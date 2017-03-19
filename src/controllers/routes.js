'use strict';

const Quest = require('../models/quest');
const QuestFilter = require('../view_models/quest-filter');
require('../models/user');
require('../models/photo');
let questFilter = new QuestFilter();
exports.initRouters = app => {
    app.get('/', (req, res) => {
        res.render('main-page', {
            filter: questFilter.toJson()
        });
    });

    app.get('/questlist', (req, res) => {
        let value;
        if (req.query.value) {
            value = req.query.value;
        }
        Quest.find()
            .select('title author photos description -_id id likesCount rating')
            .populate('author', '-_id id name')
            .populate('photos', '-_id url')
            .exec()
            .then(data => {
                data = questFilter.handle(value, data, req.query);
                if (req.query.render === 'true') {
                    res.render('quest-list', {
                        quests: data,
                        layout: false
                    });
                } else {
                    res.send(data);
                }
            });
    });

    app.get('/profile', () => {
        //
    });

    app.get('/profile/:id', () => {
        //
    });

    app.get('/quest/:id', () => {
        //
    });

    app.get('/quest/:id/details', () => {
        //
    });

    app.get('/myquests', () => {
        //
    });

    app.get('/newquest', () => {
        //
    });

    app.get('/editquest/:id', () => {
        //
    });

    app.post('/signin', () => {
        //
    });

    app.post('/signup', () => {
        //
    });

    app.post('/rating', () => {
        //
    });

    app.use((req, res) => {
        res.status(404);
    });

    app.use((err, req, res) => {
        console.error(err.stack);
        res.status(500);
    });
};
