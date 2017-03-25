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
        const testUserId = '58ce93feea5f3303332a4f7c';
        User.findById(testUserId, 'name photoURL rating quests')
            .populate({
                path: 'quests.questId',
                select: 'title author photos description -_id id likesCount rating',
                populate: [
                    {
                        path: 'photos',
                        select: '-_id url'
                    },
                    {
                        path: 'author',
                        select: '-_id id name'
                    }
                ]
            })
            .exec((err, user) => {
                if (err || !user) {
                    return res.send('Not found user');
                }
                res.render('profile-page', {
                    user,
                    quests: user.quests.map(quest => {
                        return quest.questId;
                    })
                });
            });
    });

    app.post('/rating', () => {
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
        res.send('404 :(');
    });

    app.use((err, req, res) => {
        console.error(err.stack);
        res.status(500);
    });
};
