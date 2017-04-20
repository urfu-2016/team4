const router = require('express').Router;
const app = router();
const isAuthenticated = require('./../../middlewares/auth').isAuthenticated;
const controllers = require('./controllers');

app.get('/', isAuthenticated, controllers.profileCtrl);

module.exports = app;
