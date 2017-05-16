const router = require('express').Router;
const app = router();
const controllers = require('./controllers');

app.get('/', controllers.ratingCtrl);

app.get('/find', controllers.ratingFindCtrl);

module.exports = app;
