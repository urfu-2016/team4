'use strict';
const passport = require('passport');
const QuestFilter = require('../view_models/quest-filter');
const User = require('../models/user');
const Quests = require('../models/quest');
let questFilter = new QuestFilter();
const passwordHash = require('password-hash');
function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }

    res.redirect('/');
}

exports.initRouters = app => {
    app.get('/', (req, res) => {
        res.render('main-page', {
            filter: questFilter.toJson()
        });
    });

    app.use('/quests', require('./quests'));

    app.get('/profile', isAuthenticated, (req, res) => {
        function getFilteredQuests(quests, iAmAuthor) {
            return quests
                .filter(quest => {
                    return (iAmAuthor ? quest.whoAmI : !quest.whoAmI);
                })
                .map(quest => {
                    return quest.questId;
                });
        }

        if (!req.user) {
            return res.send('User Not found');
        }

        User.findById(req.user._id, 'name photoURL rating quests')
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
                    return res.send('User Not found');
                }
                res.render('profile-page', {
                    usersQuests: getFilteredQuests(user.quests, true),
                    inProcessQuests: getFilteredQuests(user.quests, false)
                });
            });
    });

    app.post('/rating', () => {
        /* eslint no-unused-vars: 0 */
    });

    app.get('/quest/:id([0-9]+)', (req, res) => {
        let questId = req.params.id;
        let buttonText = 'Начать квест';
        let text = '';
        if (!req.user) {
            text = 'Вы должны авторизоваться, чтобы участвовать в квестах.';
        }
        Quests.findOne({id: questId})
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
                text: text,
                buttonText: buttonText
            });
        });
    });

    app.get('/quest/:id/details', () => {
        /* eslint no-unused-vars: 0 */
    });

    app.get('/myquests', isAuthenticated, (req, res) => {
        res.render('my-quests-page');
    });

    app.get('/newquest', (req, res) => {
        res.render('create-quest-page', {
            photos: [
                'http://www.neighborhood-love.com/wp-content/uploads/2013/03/3D-Graphic-Graffiti-Design.jpg',
                'https://img.gazeta.ru/files3/271/7927271/pam06.jpg',
                'http://ic.pics.livejournal.com/tochkaglife/64898668/43055/43055_900.jpg'
            ]
        });
    });

    app.get('/editquest/:id', () => {
        /* eslint no-unused-vars: 0 */
    });

    app.post('/signin', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (user) {
                req.login(user, err => {
                    if (err) {
                        return next(err);
                    }

                    return res.send({message: 'OK'});
                });
            }
            res.status(403).send(info);
        })(req, res, next);
    });

    app.post('/signup', (req, res) => {
        if (!req.body.password || !req.body.name || !req.body.email) {
            return res.status(409).json({message: 'Пожалуйста заполните все поля'});
        }
        if (req.body.password !== req.body.passwordRepeat) {
            return res.status(409).json({message: 'Пароли не совпадают'});
        }

        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: passwordHash.generate(req.body.password)
        });

        user.save(function (err) {
            if (err) {
                if (err.toJSON().errmsg.includes('email')) {
                    res.status(409).json({message: 'Пользователь с таким email уже зарегестрирован'});
                } else if (err.toJSON().errmsg.includes('name')) {
                    res.status(409).json({message: 'Пользователь с таким именем уже зарегестрирован'});
                } else {
                    res.status(409).json({message: err.toJSON().errmsg});
                }
            } else {
                req.login(user, () => {
                    return res.json({message: 'OK'});
                });
            }
        });
    });

    app.get('/signout', (req, res) => {
        req.logout();
        res.redirect('/');
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
