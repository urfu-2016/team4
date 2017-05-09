const expressSession = require('express-session');
const expressJson = require('express-json');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const User = require('../models/user');
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
                    intel.warn(err);

                    return cb(err);
                }
                if (!user) {
                    intel.warn(email + ': Юзера с данным email не существует');

                    return cb(null, false, {message: 'Юзера с данным email не существует'});
                }
                if (user.vkId && !user.password) {
                    intel.warn(user.vkId + ' Данный юзер зарегестрирован через соцсеть Вконтакте');

                    return cb(null, false, {message: 'Данный юзер зарегестрирован через соцсеть Вконтакте'});
                }
                if (!passwordHash.verify(password, user.password)) {
                    intel.warn('Логин' + email + ' - неверный пароль:' + password);

                    return cb(null, false, {message: 'Неверный пароль'});
                }
                intel.info('Пользователь ' + user.name + 'успешно вошел');

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

    passport.use(new VKontakteStrategy({
        clientID: (process.env.VKONTAKTE_APP_ID || require('../../credentials').VKONTAKTE_APP_ID),
        clientSecret: (process.env.VKONTAKTE_APP_SECRET || require('../../credentials').VKONTAKTE_APP_SECRET),
        callbackURL: '/vk/cb'
    },
    /* eslint max-params: [0, 5] */
    (accessToken, refreshToken, params, profile, done) => {
        User.findOne({vkId: profile.id}).then(user => {
            if (user) {
                return done(null, user);
            }
            user = new User({
                name: profile.displayName,
                vkId: profile.id,
                email: params.email
            });
            user.save(err => {
                return done(err, user);
            });
        });
    }));

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(expressJson());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSession({secret: 'hackaton team4', resave: false, saveUninitialized: true}));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });
};

exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.redirect('/');
};

