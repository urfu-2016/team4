const User = require('../../models/user');

function getFilteredQuests(quests, iAmAuthor) {
    return quests
        .filter(quest => {
            return (iAmAuthor ? !quest.isAuthor : quest.isAuthor);
        })
        .map(quest => {
            return quest.quest;
        });
}

exports.profileCtrl = (req, res) => {
    User.findById(req.user._id, 'name photoURL rating quests')
        .populate({
            path: 'quests.quest',
            select: 'title author photos description -_id id likesCount rating',
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
        .exec((err, user) => {
            if (err || !user) {
                return res.send('User Not found');
            }
            res.render('profile-page', {
                usersQuests: getFilteredQuests(user.quests, true),
                inProcessQuests: getFilteredQuests(user.quests, false)
            });
        });
};
