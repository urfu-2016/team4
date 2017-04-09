const Handlebars = require('handlebars');
const authMiddleware = require('./middlewares/auth');

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
        if (a === b) {
            return options.fn(this);
        }

        return options.inverse(this);
    });

    Handlebars.registerHelper('if_neq', function (a, b, options) {
        if (a !== b) {
            return options.fn(this);
        }

        return options.inverse(this);
    });

    app.use((req, res, next) => {
        this.sections = {};
        res.locals.sections = this.sections;
        next();
    });

    authMiddleware.init(app);
};
