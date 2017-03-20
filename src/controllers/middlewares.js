let Handlebars = require('handlebars');
exports.init = app => {
    Handlebars.registerHelper('section', (name, options) => {
        if (!this.sections) {
            this.sections = {};
        }
        if (!this.sections[name]) {
            this.sections[name] = '';
        }
        this.sections[name] += options.fn(this).replace('\t', '');

        return null;
    });

    app.use((req, res, next) => {
        this.sections = {};
        res.locals.sections = this.sections;
        next();
    });
};
