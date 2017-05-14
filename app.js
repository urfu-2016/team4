let express = require('express');
const morgan = require('morgan');

let app = express();
let middlewares = require('./src/middlewares/middlewares');
let remoteStatic = require('remote-static');
app.set('views', 'build/hbs');

let exphbs = require('express-handlebars');

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: 'build/layouts',
    partialsDir: 'build/hbs'
}));

middlewares.init(app);

if (process.env.NODE_ENV && process.env.NODE_ENV === 'prod') {
    console.log('prod');
    app.use('/static', remoteStatic('https://super-photo-quest.surge.sh'));
} else {
    console.log('dev');
    app.use('/static', express.static('build/public'));
}

app.use(morgan('combined'));

// app.use(require('connect-livereload')());
app.set('view engine', '.hbs');
app.set('port', process.env.PORT || 8080);

let mongoose = require('mongoose');
let redis = require('redis');
let cachegoose = require('cachegoose');
let cachegooseConfig = {
    engine: 'redis',
    port: 6379,
    host: 'localhost'
};

if (process.env.REDIS_URL) {
    cachegooseConfig = require('parse-redis-url')(redis).parse(process.env.REDIS_URL);
}
cachegoose(mongoose, cachegooseConfig);

let mongoOpt = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};

mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb://' +
    (process.env.MONGO_USER || require('./credentials').MONGO_USER) + ':' +
    (process.env.MONGO_PASS || require('./credentials').MONGO_PASS) +
    '@ds129090.mlab.com:29090/yaheckaton', mongoOpt);

app.use('/', require('./src/apps/app/routes'));

app.listen(app.get('port'), function () {
    console.log('Server start on ' +
        app.get('port') +
        '. Ctrl + C for exit.');
});
