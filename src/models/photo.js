'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
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
