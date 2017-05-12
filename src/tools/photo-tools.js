const cloudinary = require('./cloudinary');

function deletePhoto(photo, done) {
    let publicId = photo.url
        .split('/')[photo.url.split('/').length - 1]
        .split('.')[0];
    photo.remove(err => {
        if (err) {
            return done(err);
        }
        cloudinary.deletePhoto(publicId, () => {
            // независимо от результата не возвращаем ошибку
            done();
        });
    });
}

function deletePhotos(photos, done) {
    let count = 0;
    if (!photos.length) {
        return done();
    }
    let hadError = false;
    photos.forEach(photo => {
        deletePhoto(photo, err => {
            count++;
            if (hadError) {
                return;
            }
            if (err) {
                hadError = true;

                return done(err);
            }

            if (count === photos.length) {
                return done();
            }
        });
    });
}

function savePhotos(photos, done) {
    let count = 0;
    if (!photos.length) {
        return done();
    }
    let hadError = false;
    photos.forEach(photo => {
        photo.save(err => {
            count++;
            if (hadError) {
                return;
            }
            if (err) {
                hadError = true;

                return done(err);
            }

            if (count === photos.length) {
                return done();
            }
        });
    });
}

exports.deletePhoto = deletePhoto;
exports.deletePhotos = deletePhotos;
exports.savePhotos = savePhotos;
