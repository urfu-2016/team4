const router = require('express').Router;
const app = router();
const controllers = require('./controllers');
const isAuthenticated = require('./../../middlewares/auth').isAuthenticated;

app.get('/', controllers.indexCtrl);

app.use('/rating', require('./../ratings/routes'));

app.use('/', require('./../auth/routes'));

app.use('/quests', require('./../quests/routes'));

app.use('/profile', require('./../profile/routes'));

app.post('/uploadPhoto', isAuthenticated, controllers.uploadPhoto);

app.use('*', (req, res) => {
    res.status(404);
    res.render('page-404');
});

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500);
});

module.exports = app;
