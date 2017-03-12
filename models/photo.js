/**
 * Created by trefi on 12.03.2017.
 */

'use strict';

var mongoose = require('mongoose');

var photoSchema = mongoose.Schema({
    url: String,
    geoPosition: {
        lat: Number,
        lng: Number
    },
    comments: [
        {
            comment: String
        }
    ]
});

var photo = mongoose.model('photo', photoSchema);

module.exports = photo;
