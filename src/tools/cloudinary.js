/* eslint camelcase: 'off', no-trailing-spaces: 'off' */
'use strict';

const fs = require('fs');
let cloudinary = require('cloudinary');
let credentials = process.env.CLOUDINARY_CLOUD_NAME ? process.env : require('./../../credentials');
const config = {
    cloud_name: credentials.CLOUDINARY_CLOUD_NAME,
    api_key: credentials.CLOUDINARY_API_KEY,
    api_secret: credentials.CLOUDINARY_API_SECRET
};

cloudinary.config(config);

/**
 * сохранение фото
 *
 * @param file
 * @param callback
 */
exports.savePhoto = (file, callback) => {
    cloudinary
        .uploader
        .upload(file, result => {
            fs.unlink(file, function (err) {
                if (err) {
                    console.info(err);
                }
            });
            callback(result);
        });
};

/**
 * генерирование url фотографии с переданами параметрами (settings)
 *
 * @param publicId
 * @param settings: *
 * {
 *  width - ширина
 *  height - высота
 *  crop: [scale, fit, fill, south_east, limit, pad, crop, thumb] - обрезка фотографии
 *  format: formats: [jpg, png, gif, bmp, tiff, ico, pdf, eps, psd, webp, svg, wdp] - формат фотографии
 *  gravity: [true, false] - если true, то распознается лицо и централизуется
 * }
 *
 */
exports.getGeneratedPhotoURL = (publicId, settings) => {
    return cloudinary
        .url(publicId, {
            width: settings.width,
            height: settings.height,
            crop: settings.crop,
            format: settings.format,
            gravity: (settings.isFace ? 'face' : undefined)
        });
};

/**
 * удаление фото
 *
 * @param publicId
 * @param callback
 */
exports.deletePhoto = (publicId, callback) => {
    cloudinary
        .uploader
        .destroy(publicId, result => {
            callback(result);
        });
};
