let User = require('../../models/user');

function getPositionedUsers(myUser, name, cb) {
    let done = cb;
    if (cb === undefined) {
        done = name;
        name = undefined;
    }
    User.find()
        .sort({rating: -1})
        .limit(50)
        .exec((err, users) => {
            if (err) {
                done(err);
            }
            let position = 0;
            let lastRating = -1;

            users.forEach(user => {
                if (lastRating !== user.rating) {
                    position++;
                }

                if (myUser && myUser.id === user.id) {
                    myUser.position = position;
                }

                user.position = position;
                lastRating = user.rating;
            });
            if (name) {
                users = users.filter(user => {
                    return Boolean(user.name.match(new RegExp(name, 'i')));
                });
            }
            if (myUser && users[0].id === myUser.id) {
                users.shift();
            }

            done(err, users);
        });
}

exports.ratingCtrl = (req, res) => {
    getPositionedUsers(req.user, (err, members) => {
        if (err) {
            res.sendStatus(500);
        }

        res.render('ratings-page', {
            members: members
        });
    });
};

exports.ratingFindCtrl = (req, res) => {
    getPositionedUsers(req.user, req.query.name, (err, members) => {
        if (err) {
            res.sendStatus(500);
        }

        res.render('ratings-page-users-list', {
            members: members,
            layout: false
        });
    });
};
