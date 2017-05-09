const router = require('express').Router;
const app = router();
const controllers = require('./controllers');
const isAuthenticated = require('./../../middlewares/auth').isAuthenticated;

app.get('/', controllers.questsCtrl);

app.get('/my', isAuthenticated, controllers.myQuestsCtrl);

app.get('/:id([0-9]+)', controllers.questCtrl);

app.get('/new', isAuthenticated, controllers.newQuestCtrl);

app.post('/new', isAuthenticated, controllers.newQuestPostCtrl);

app.get('/:id([0-9]+)/edit', isAuthenticated);

module.exports = app;
