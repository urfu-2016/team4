const passport = require('passport');
const passwordHash = require('password-hash');
const User = require('../../models/user');

exports.signInCtrl = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (user) {
            req.login(user, err => {
                if (err) {
                    return next(err);
                }

                return res.send({message: 'OK'});
            });
        }
        res.status(403).send(info);
    })(req, res, next);
};

exports.signUpCtrl = (req, res) => {
    if (!req.body.password || !req.body.name || !req.body.email) {
        return res.status(409).json({message: 'Пожалуйста заполните все поля'});
    }
    if (req.body.password !== req.body.passwordRepeat) {
        return res.status(409).json({message: 'Пароли не совпадают'});
    }

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash.generate(req.body.password)
    });

    user.save(err => {
        if (err) {
            if (err.toJSON().errmsg.includes('email')) {
                res.status(409).json({message: 'Пользователь с таким email уже зарегестрирован'});
            } else {
                res.status(409).json({message: err.toJSON().errmsg});
            }
        } else {
            req.login(user, () => {
                return res.json({message: 'OK'});
            });
        }
    });
};

exports.vkAuth = (req, res, next) => {
    passport.authenticate('vkontakte', (err, user) => {
        if (err) {
            if (err.toJSON && err.toJSON().errmsg.includes('email')) {
                res.redirect('/?emailexist');
            } else {
                next(err);
            }
        } else {
            req.login(user, err => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        }
    })(req, res, next);
};

exports.signOutCtrl = (req, res) => {
    req.logout();
    res.redirect('/');
};
