const router = require('express').Router;
const app = router();
const isAuthenticated = require('./../../middlewares/auth').isAuthenticated;
const controllers = require('./controllers');
const multer = require('multer');
const pathForImages = 'uploads/';
const upload = multer({dest: pathForImages});

app.get('/:id([0-9]+)', controllers.profileCtrl);
app.post('/', isAuthenticated, upload.single('avatar'), controllers.profileSaveAvatar);

module.exports = app;
