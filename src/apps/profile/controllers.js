/* eslint handle-callback-err: 'off' */
const User = require('../../models/user');
const cacheTools = require('../../tools/cache-tools');
const getCacheKey = cacheTools.getCacheKey;
const wrapForUser = require('../../tools/quest-tools').wrapForUser;

function getFilteredQuests(quests, iAmAuthor, user) {
    return quests
        .filter(quest => {
            return (iAmAuthor ? quest.isAuthor : !quest.isAuthor) && quest.quest.isPublished;
        })
        .map(quest => {
            return wrapForUser(quest.quest, user);
        });
}

function getUser(id, cached) {
    cached = cached === undefined ? true : cached;
    let query = User.findOne({id: id}, 'name photoURL rating id quests information')
        .populate({
            path: 'quests.quest',
            select: 'title author photos description _id id likesCount rating isPublished',
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
        });
    if (cached) {
        query = query
            .cache(0, getCacheKey('user', id))
            .lean();
    }

    return query;
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
    getUser(req.user.id, false).exec((err, user) => {
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

exports.profileSaveInformation = (req, res) => {
    getUser(req.user.id, false).exec((err, user) => {
        let info = req.body.info;
        if (info.edit) {
            for (let i = 0; i < user.information.length; i++) {
                if (user.information[i].index === info.index) {
                    user.information[i].name = info.name;
                    user.information[i].value = info.value;
                }
            }
        } else {
            user.information.push({name: info.name, value: info.value, index: info.index});
        }
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

exports.profileDeleteInformation = (req, res) => {
    getUser(req.user.id, false).exec((err, user) => {
        let index = parseInt(req.body.index.index, 10);
        let deleteIndex = 0;

        for (let i = 0; i < user.information.length; i++) {
            if (user.information[i].index === index) {
                deleteIndex = i;
                break;
            }
        }
        user.information.splice(deleteIndex, 1);

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
