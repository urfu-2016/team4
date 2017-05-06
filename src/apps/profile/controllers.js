/* eslint handle-callback-err: 'off' */
const User = require('../../models/user');
const cloudinary = require('../../tools/cloudinary');
const fs = require('fs');
const joinPath = require('path.join');
const pathForImages = 'uploads/';

function getFilteredQuests(quests, iAmAuthor) {
    return quests
        .filter(quest => {
            return (iAmAuthor ? !quest.isAuthor : quest.isAuthor);
        })
        .map(quest => {
            return quest.quest;
        });
}

function removeFilesInFolder(folder) {
    fs.readdir(folder, (err, items) => {
        if (err) {
            console.log(err);
        } else {
            for (let i = 0; i < items.length; i++) {
                fs.unlink(joinPath(folder, items[i]), function (err) {
                    if (err) {
                        console.info(err);
                    }
                });
            }
        }
    });
}

function renderProfilePageForUser(req, res, isPost, result) {
    if (!req.user) {
        return res.send('User Not found');
    }
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
            if (isPost) {
                user.photoURL = result.url;
                user.save(function (err) {
                    if (err) {
                        console.info(err);
                    }
                });
            }
            res.render('profile-page', {
                userPhoto: user.photoURL,
                usersQuests: getFilteredQuests(user.quests, true),
                inProcessQuests: getFilteredQuests(user.quests, false)
            });
        });
}

exports.profileCtrl = (req, res) => {
    renderProfilePageForUser(req, res);
};

exports.profileLoadAvatar = (req, res) => {
    if (!req.file) {
        return res.send('Ой, ошибочка, проверьте выбран ли файл');
    }
    cloudinary.savePhoto(req.file.path, result => {
        removeFilesInFolder(pathForImages);
        renderProfilePageForUser(req, res, true, result);
    });
};
