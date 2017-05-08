const Handlebars = require('handlebars');
const authMiddleware = require('./auth');
const bodyParser = require('body-parser');

exports.init = app => {
    Handlebars.registerHelper('section', (name, options) => {
        if (!this.sections) {
            this.sections = {};
        }

        if (!this.sections[name]) {
            this.sections[name] = [];
        }
        let sectionData = options.fn(this).replace('\t', '');
        if (this.sections[name].indexOf(sectionData) === -1) {
            this.sections[name].unshift(sectionData);
        }

        return null;
    });

    Handlebars.registerHelper('if_eq', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('if_neq', function (a, b, options) {
        return a === b ? options.inverse(this) : options.fn(this);
    });

    Handlebars.registerHelper('concat', function (a, b) {
        return a + b;
    });

    app.use(bodyParser.json({limit: '5mb'}));
    app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
    app.use((req, res, next) => {
        this.sections = {};
        res.locals.sections = this.sections;
        next();
    });

    authMiddleware.init(app);
};
