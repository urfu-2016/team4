var express = require('express');
var app = express();

app.set('port', process.env.PORT || 4725);

var mongoose = require('mongoose');

var mongoOpt = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:1qazXSW@ds129090.mlab.com:29090/yaheckaton', mongoOpt);

var routers = require('./controllers/routes');

routers.initRouters(app);

app.listen(app.get('port'), () => {
    console.log('Server start on ' +
        app.get('port') +
        '. Ctrl + C for exit.');
});
