/**
 * Created by trefi on 12.03.2017.
 */

'use strict';

const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
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

module.exports = mongoose.model('photo', photoSchema);
