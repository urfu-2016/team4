let express = require('express');
let app = express();

app.set('views', 'build/views');

let exphbs = require('express-handlebars');

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: 'build/layouts',
    partialsDir: 'build/hbs'
}));

app.use('/static', express.static('build/public'));

app.set('view engine', '.hbs');

app.set('port', process.env.PORT || 8080);

let mongoose = require('mongoose');

let mongoOpt = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};

// user и пароль от монго
const credentials = require('./credentials');

mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb://' + credentials.MONGO_USER + ':' +
    credentials.MONGO_PASS + '@ds129090.mlab.com:29090/yaheckaton', mongoOpt);

let routers = require('./build/controllers/routes');

routers.initRouters(app);

app.listen(app.get('port'), function () {
    console.log('Server start on ' +
        app.get('port') +
        '. Ctrl + C for exit.');
});
