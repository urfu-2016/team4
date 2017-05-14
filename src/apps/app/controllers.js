const QuestFilter = require('../../view_models/quest-filter');
let questFilter = new QuestFilter();
const cloudinary = require('../../tools/cloudinary');
const joinPath = require('path.join');
const fs = require('fs');
const pathForImages = 'uploads/';
const getFileName = require('unique-name');
let intel = require('intel');

exports.indexCtrl = (req, res) => {
    res.render('main-page', {
        filter: questFilter.toJson()
    });
};

exports.ratingCtrl = (req, res) => {
    res.render('ratings-page');
};

exports.uploadPhoto = (req, res) => {
    function decodeBase64Image(dataString) {
        let matches = dataString.replace(/data:([A-Za-z-+/]+);base64,/, '');
        matches = matches.split(' ').join('+');

        return new Buffer(matches, 'base64');
    }
    let base64Data = req.body.image;
    let imageBuffer = decodeBase64Image(base64Data);
    let imageName = getFileName.gen();
    fs.writeFile(joinPath(pathForImages, imageName), imageBuffer, function (err) {
        if (err) {
            intel.warn(err);
            console.log(err);
        }
    });
    cloudinary.savePhoto(joinPath(pathForImages, imageName), result => {
        res.send(result.secure_url);
    });
};
