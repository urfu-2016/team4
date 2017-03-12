var express = require('express');
var app = express();

app.set('views', './src/blocks');

var exphbs = require('express-handlebars');

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir:'src/blocks/layouts/',
    partialsDir:'src/blocks/partials/'
}));
app.set('view engine', '.hbs');

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir:'src/blocks/layouts/',
    partialsDir:'src/blocks/partials/'
}));
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 8080);

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

var routers = require('./src/controllers/routes');

routers.initRouters(app);

app.listen(app.get('port'), function(){
    console.log('Server start on ' +
        app.get('port') +
        '. Ctrl + C for exit.');
});
