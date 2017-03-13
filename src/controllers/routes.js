'use strict';

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
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
=======
exports.initRouters = function (app) {
	app.get('/', function (req, res) {
                /* eslint no-unused-vars: 0 */
		res.render('main-page');
	});

	app.get('/profile', function (req, res) {
>>>>>>> настроила тесты
        /* eslint no-unused-vars: 0 */
	});

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    app.get('/profile/:id', () => {
=======
	app.get('/quest/:id', function (req, res) {
>>>>>>> настроила тесты
        /* eslint no-unused-vars: 0 */
	});

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    app.get('/quest/:id', () => {
=======
	app.get('/quest/:id/details', function (req, res) {
>>>>>>> настроила тесты
        /* eslint no-unused-vars: 0 */
	});

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    app.get('/quest/:id/details', () => {
=======
	app.get('/myquests', function (req, res) {
>>>>>>> настроила тесты
        /* eslint no-unused-vars: 0 */
	});

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    app.get('/myquests', () => {
=======
	app.get('/newquest', function (req, res) {
>>>>>>> настроила тесты
        /* eslint no-unused-vars: 0 */
	});

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    app.get('/newquest', () => {
=======
	app.get('/editquest/:id', function (req, res) {
>>>>>>> настроила тесты
        /* eslint no-unused-vars: 0 */
	});

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    app.get('/editquest/:id', () => {
=======
	app.post('/signin', function (req, res) {
>>>>>>> настроила тесты
        /* eslint no-unused-vars: 0 */
	});

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    app.post('/signin', () => {
=======
	app.post('/signup', function (req, res) {
>>>>>>> настроила тесты
        /* eslint no-unused-vars: 0 */
	});

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    app.post('/signup', () => {
=======
	app.post('/rating', function (req, res) {
>>>>>>> настроила тесты
        /* eslint no-unused-vars: 0 */
	});

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
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
=======
	app.use(function (req, res) {
        /* eslint no-unused-vars: 0 */
		res.status(404);
	});

	app.use(function (err, req, res) {
        /* eslint no-unused-vars: 0 */
		console.error(err.stack);
		res.status(500);
	});
>>>>>>> настроила тесты
};
