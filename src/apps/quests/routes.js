const router = require('express').Router;
const app = router();
const controllers = require('./controllers');
const isAuthenticated = require('./../../middlewares/auth').isAuthenticated;

app.get('/', controllers.questsCtrl);

app.get('/my', isAuthenticated, controllers.myQuestsCtrl);

app.get('/:id([0-9]+)', controllers.questCtrl);

app.get('/:id([0-9]+)/details', controllers.questDetailsCtrl);

app.get('/new', isAuthenticated, controllers.newQuestCtrl);

app.get('/:id([0-9]+)/edit', isAuthenticated);

module.exports = app;
