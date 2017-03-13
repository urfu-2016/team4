let express = require('express');
let app = express();
let middlewares = require('./build/controllers/middlewares');
app.set('views', 'build/hbs');

let exphbs = require('express-handlebars');

app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs',
	layoutsDir: 'build/layouts',
	partialsDir: 'build/hbs'
}));

middlewares.init(app);
app.use('/static', express.static('build/public'));
app.use(require('connect-livereload')());
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

mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb://' +
    (process.env.MONGO_USER || require('./credentials').MONGO_USER) + ':' +
    (process.env.MONGO_PASS || require('./credentials').MONGO_PASS) +
    '@ds129090.mlab.com:29090/yaheckaton', mongoOpt);

let routers = require('./build/controllers/routes');

routers.initRouters(app);

app.listen(app.get('port'), function () {
	console.log('Server start on ' +
        app.get('port') +
        '. Ctrl + C for exit.');
});
