const router = require('express').Router;
const app = router();
const controllers = require('./controllers');
const isAuthenticated = require('./../../middlewares/auth').isAuthenticated;

app.get('/', controllers.questsCtrl);

app.get('/my', isAuthenticated, controllers.myQuestsCtrl);

app.get('/:id([0-9]+)', controllers.questCtrl);

app.post('/:id([0-9]+)/checkPhoto/:index([0-9]+)', controllers.questCheckPhotoCtrl);

app.get('/new', isAuthenticated, controllers.newQuestCtrl);

app.post('/new', isAuthenticated, controllers.newQuestPostCtrl);

app.post('/:id([0-9]+)/edit', isAuthenticated, controllers.editQuestPostCtrl);

app.get('/:id([0-9]+)/edit', isAuthenticated, controllers.questEdit);

app.get('/:id([0-9]+)/participate', isAuthenticated, controllers.questParticipate);

app.post('/:id([0-9]+)/remove', isAuthenticated, controllers.removeQuestCtrl);

app.get('/:id([0-9]+)/like', isAuthenticated, controllers.addLikeCtrl);

module.exports = app;
