const router = require('express').Router;
const app = router();
const controllers = require('./controllers');

app.get('/', controllers.indexCtrl);

app.get('/rating', controllers.ratingCtrl);

app.use('/', require('./../auth/routes'));

app.use('/quests', require('./../quests/routes'));

app.use('/profile', require('./../profile/routes'));

app.use('*', (req, res) => {
    res.status(404);
    res.render('page-404');
});

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500);
});

module.exports = app;
