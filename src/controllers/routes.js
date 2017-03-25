'use strict';

const QuestFilter = require('../view_models/quest-filter');
let questFilter = new QuestFilter();
exports.initRouters = app => {
    app.get('/', (req, res) => {
        res.render('main-page', {
            filter: questFilter.toJson()
        });
    });

    app.use('/quests', require('./quests'));

    app.get('/profile', () => {
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
