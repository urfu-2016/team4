const router = require('express').Router;
const app = router();
const isAuthenticated = require('./../../middlewares/auth').isAuthenticated;
const controllers = require('./controllers');
const multer = require('multer');
const pathForImages = 'uploads/';
const upload = multer({dest: pathForImages});

app.get('/', isAuthenticated, controllers.profileCtrl);
app.post('/', isAuthenticated, upload.single('avatar'), controllers.profileLoadAvatar);

module.exports = app;
