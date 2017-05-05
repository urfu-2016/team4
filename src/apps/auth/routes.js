const router = require('express').Router;
const app = router();
const controllers = require('./controllers');
const passport = require('passport');

app.post('/signin', controllers.signInCtrl);

app.post('/signup', controllers.signUpCtrl);

app.get('/signout', controllers.signOutCtrl);

app.get('/vk', passport.authenticate('vkontakte', {scope: ['email']}));

app.get('/vk/cb', controllers.vkAuth);

module.exports = app;
