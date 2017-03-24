'use strict';

const QuestFilter = require('../view_models/quest-filter');
const User = require('../models/user');
require('../models/user');
require('../models/photo');
let questFilter = new QuestFilter();
exports.initRouters = app => {
    app.get('/', (req, res) => {
        res.render('main-page', {
            filter: questFilter.toJson()
        });
    });

    app.use('/quests', require('./quests'));

    app.get('/profile', (req, res) => {
        User.findById('58ce93feea5f3303332a4f7c', 'name photoURL rating')
            .exec((err, user) => {
                if (err || !user) {
                    return res.send('Not found user');
                }
                res.render('profile-page', {
                    user
                });
            });
    });

    app.get('/profile/:id', () => {
    });

    app.get('/quest/:id', () => {
    });

    app.get('/quest/:id/details', () => {
    });

    app.get('/myquests', () => {
    });

    app.get('/newquest', () => {
    });

    app.get('/editquest/:id', () => {
    });

    app.post('/signin', () => {
    });

    app.post('/signup', () => {
    });

    app.post('/rating', () => {
    });

    app.use((req, res) => {
        res.status(404);
        res.send('404 :(');
    });

    app.use((err, req, res) => {
        console.error(err.stack);
        res.status(500);
    });
};
