const router = require('express').Router;
const app = router();
const controllers = require('./controllers');

app.post('/signin', controllers.signInCtrl);

app.post('/signup', controllers.signUpCtrl);

app.get('/signout', controllers.signOutCtrl);

module.exports = app;
