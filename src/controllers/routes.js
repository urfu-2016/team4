'use strict';

const Quest = require('../models/quest');
const QuestFilter = require('../view_models/quest-filter');
require('../models/user');
require('../models/photo');
let questFilter = new QuestFilter();
exports.initRouters = app => {
    app.get('/', (req, res) => {
        /* eslint no-unused-vars: 0 */
        res.render('main-page', {
            filter: questFilter.toJson()
        });
    });

    app.get('/questlist', (req, res) => {
        /* eslint no-unused-vars: 0 */
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
        /* eslint no-unused-vars: 0 */
    });

    app.get('/profile/:id', () => {
            /* eslint no-unused-vars: 0 */
    });

    app.get('/quest/:id', () => {
            /* eslint no-unused-vars: 0 */
    });

    app.get('/quest/:id/details', () => {
            /* eslint no-unused-vars: 0 */
    });

    app.get('/myquests', () => {
            /* eslint no-unused-vars: 0 */
    });

    app.get('/newquest', () => {
            /* eslint no-unused-vars: 0 */
    });

    app.get('/editquest/:id', () => {
            /* eslint no-unused-vars: 0 */
    });

    app.post('/signin', () => {
            /* eslint no-unused-vars: 0 */
    });

    app.post('/signup', () => {
            /* eslint no-unused-vars: 0 */
    });

    app.post('/rating', () => {
            /* eslint no-unused-vars: 0 */
    });

    app.use((req, res) => {
        res.status(404);
    });

    app.use((err, req, res) => {
        console.error(err.stack);
        res.status(500);
    });
};
