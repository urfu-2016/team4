const cloudinary = require('./cloudinary');

function deletePhoto(photo, done) {
    let publicId = photo.url
        .split('/')[photo.url.split('/').length - 1]
        .split('.')[0];
    photo.remove(err => {
        if (err) {
            return done(err);
        }
        cloudinary.deletePhoto(publicId, done);
    });
}

function deletePhotos(photos, done) {
    let count = 0;
    if (!photos.length) {
        done();
    }
    photos.forEach(photo => {
        deletePhoto(photo, err => {
            count++;
            if (err) {
                done(err);
            }

            if (count === photos.length) {
                done();
            }
        });
    });
}

exports.deletePhoto = deletePhoto;
exports.deletePhotos = deletePhotos;
