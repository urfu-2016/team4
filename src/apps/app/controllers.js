const QuestFilter = require('../../view_models/quest-filter');
let questFilter = new QuestFilter();
const cloudinary = require('../../tools/cloudinary');
const joinPath = require('path.join');
const fs = require('fs');
const pathForImages = 'uploads/';
const getFileName = require('unique-name');

exports.indexCtrl = (req, res) => {
    res.render('main-page', {
        filter: questFilter.toJson()
    });
};

exports.ratingCtrl = (req, res) => {
    res.render('ratings-page');
};

exports.uploadPhoto = (req, res) => {
    console.info(1);
    function decodeBase64Image(dataString) {
        let matches = dataString.replace(/data:([A-Za-z-+/]+);base64,/, '');
        matches = matches.split(' ').join('+');
        let buffer = new Buffer(matches, 'base64');

        return buffer;
    }

    let base64Data = req.body.image;
    let imageBuffer = decodeBase64Image(base64Data);
    let imageName = getFileName.gen();
    fs.writeFile(joinPath(pathForImages, imageName), imageBuffer, function (err) {
        if (err) {
            console.log(err);
        }
    });

    cloudinary.savePhoto(joinPath(pathForImages, imageName), result => {
        //  в будущем здесь будет сохранение в бд
        // console.info(result.url); <- тут ссылка на картинку
        res.send(result.url);
    });
};
