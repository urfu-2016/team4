// const cloudinary = require('./cloudinary');

function deletePhoto(photo, done) {
    // let url = photo.url;
    photo.remove(err => {
        if (err) {
            return done(err);
        }
        // тут нужно допилить функционал удаления из cloudinary
        // cloudinary.deletePhoto()
        done();
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
