'use strict';

exports.initRouters = app => {
    app.get('/', (req, res) => {
        res.render('main-page');
    });

    app.get('/profile', () => {
        //
    });

    app.get('/quest/:id', () => {
        //
    });

    app.get('/quest/:id/details', () => {
        //
    });

    app.get('/myquests', () => {
        //
    });

    app.get('/newquest', () => {
        //
    });

    app.get('/editquest/:id', () => {
        //
    });

    app.post('/signin', () => {
        //
    });

    app.post('/signup', () => {
        //
    });

    app.post('/rating', () => {
        //
    });

    app.use((req, res) => {
        res.status(404);
    });

    app.use((err, req, res) => {
        console.error(err.stack);
        res.status(500);
    });
};
