/* eslint handle-callback-err: 'off' */
const User = require('../../models/user');
const cacheTools = require('../../tools/cache-tools');
const getCacheKey = cacheTools.getCacheKey;
const wrapForUser = require('../../tools/quest-tools').wrapForUser;

function getFilteredQuests(quests, iAmAuthor, user) {
    return quests
        .filter(quest => {
            return (iAmAuthor ? quest.isAuthor : !quest.isAuthor);
        })
        .map(quest => {
            return wrapForUser(quest.quest, user);
        });
}

function getUser(id) {
    return User.findOne({id: id}, 'name photoURL rating id quests')
        .populate({
            path: 'quests.quest',
            select: 'title author photos description _id id likesCount rating',
            populate: [
                {
                    path: 'photos',
                    select: '-_id url'
                },
                {
                    path: 'author',
                    select: '-_id id name'
                }
            ]
        })
        .cache(0, getCacheKey('user', id))
        .lean();
}

exports.getUser = getUser;

exports.profileCtrl = (req, res) => {
    getUser(req.params.id)
        .exec((err, user) => {
            if (!user) {
                res.status(404);

                return res.render('page-404');
            }
            res.render('profile-page', {
                profile: user,
                createdQuests: getFilteredQuests(user.quests, true, user),
                inProcessQuests: getFilteredQuests(user.quests, false, user)
            });
        });
};

exports.profileSaveAvatar = (req, res) => {
    getUser(req.user.id).exec((err, user) => {
        user.photoURL = req.body.url;
        user.save(function (err) {
            if (err) {
                console.info(err);

                return res.sendStatus(500);
            }
            cacheTools.clearCache('user', req.user);
        });

        return res.sendStatus(200);
    });
};
