
const Handlebars = require('handlebars');
const authMiddleware = require('./auth');
const bodyParser = require('body-parser');
require('./intel-logger').init();

let ExpressHandlebars = require('express-handlebars').ExpressHandlebars;

exports.init = app => {
    ExpressHandlebars.prototype._renderTemplate = (template, context, options) => {
        let data = template(context, options);
        if (this.sections) {
            context.sections = this.sections;
            this.sections = [];
            data = template(context, options);
        }

        return data;
    };
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

    Handlebars.registerHelper('if_in', function (elem, list, options) {
        if (list.indexOf(elem) !== -1) {
            return options.fn(this);
        }

        return options.inverse(this);
    });

    Handlebars.registerHelper('if_not_in', function (elem, list, options) {
        if (list.indexOf(elem) !== -1) {
            return options.inverse(this);
        }

        return options.fn(this);
    });

    Handlebars.registerHelper('if_len_ls', function (a, b, options) {
        return a.length < b ? options.fn(this) : options.inverse(this);
    });

    app.use(bodyParser.json({limit: '5mb'}));
    app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

    authMiddleware.init(app);
};
