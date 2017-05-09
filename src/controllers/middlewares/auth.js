const expressSession = require('express-session');
const expressJson = require('express-json');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const User = require('../../models/user');
const passwordHash = require('password-hash');
let intel = require('intel');
exports.init = app => {
    passport.use(new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        (email, password, cb) => {
            User
                .findOne({email: email})
                .exec((err, user) => {
                    if (err) {
                        return cb(err);
                    }
                    if (!user) {
                        intel.warn(email + ' Нет такого пользователя');

                        return cb(null, false, {message: 'Юзера с данным email не существует'});
                    }
                    if (!passwordHash.verify(password, user.password)) {
                        intel.warn(user.name + ' ' + user.email + 'Неверный пароль');

                        return cb(null, false, {message: 'Неверный пароль'});
                    }

                    return cb(null, user);
                });
        }));

    passport.serializeUser((user, cb) => {
        cb(null, user._id);
    });

    passport.deserializeUser(function (id, cb) {
        User.findById(id, (err, user) => {
            cb(err, user);
        });
    });

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(expressJson());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSession({secret: 'hackaton team4', resave: false, saveUninitialized: true}));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        //
        res.locals.user = req.user;
        next();
    });
};
