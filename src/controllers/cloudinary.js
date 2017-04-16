/* eslint camelcase: 'off' */
'use strict';

let cloudinary = require('cloudinary');
let credentials = process.env.CLOUDINARY_CLOUD_NAME ? process.env : require('../../credentials');

exports.savePhoto = (file, callback) => {
    cloudinary.config({
        cloud_name: credentials.CLOUDINARY_CLOUD_NAME,
        api_key: credentials.CLOUDINARY_API_KEY,
        api_secret: credentials.CLOUDINARY_API_SECRET
    });

    cloudinary.uploader.upload(file, result => {
        callback(result);
    });
};
