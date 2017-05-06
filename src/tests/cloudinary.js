/* eslint quote-props: ["error", "as-needed", { "keywords": true, "unnecessary": false }] */
'use strict';

const assert = require('assert');
const cloudinary = require('../tools/cloudinary');
const testingFile = 'http://www.logospike.com/wp-content/uploads/2014/11/Yandex_logo.jpg';
const testingSettings = {
    width: 400,
    height: 400,
    crop: 'crop',
    format: 'png',
    isFace: true
};
let publicId;

describe('Cloudinary', () => {
    it('Saving', function (done) {
        this.timeout(2500);
        cloudinary.savePhoto(testingFile, result => {
            publicId = result.public_id;
            assert.equal(result.original_filename, 'Yandex_logo');
            done();
        });
    });

    it('URL generating', () => {
        assert.equal(cloudinary.getGeneratedPhotoURL(publicId, testingSettings),
            'http://res.cloudinary.com/dmalgmz7k/image/upload/c_' +
            testingSettings.crop +
            (testingSettings.isFace ? ',g_face,' : '') +
            'h_' + testingSettings.height + ',' +
            'w_' + testingSettings.width + '/' +
            publicId + '.' + testingSettings.format);
    });

    it('Renaming', done => {
        cloudinary.renamePhoto(publicId, 'testing-photo', result => {
            assert.equal(result.public_id, 'testing-photo');
            done();
        });
    });

    it('Deleting', done => {
        cloudinary.deletePhoto('testing-photo', result => {
            assert.equal(result.result, 'ok');
            done();
        });
    });
});
