/**
 * Created by trefi on 12.03.2017.
 */

'use strict';

exports.initRouters = function (app) {
    app.get('/', function (req, res) {
        res.render('main-page');
    });

    app.get('/profile', function (req, res) {
        //
    });

    app.get('/quest/:id', function (req, res) {
        //
    });

    app.get('/quest/:id/details', function (req, res) {
        //
    });

    app.get('/myquests', function (req, res) {
        //
    });

    app.get('/newquest', function (req, res) {
        //
    });

    app.get('/editquest/:id', function (req, res) {
        //
    });

    app.post('/signin', function (req, res) {
        //
    });

    app.post('/signup', function (req, res) {
        //
    });

    app.post('/rating', function (req, res) {
        //
    });

    app.use(function (req, res) {
        res.status(404);
    });

    app.use(function (err, req, res) {
        console.error(err.stack);
        res.status(500);
    });
};
