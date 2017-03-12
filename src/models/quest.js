'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* eslint new-cap: 0 */
const questSchema = new Schema({
    id: Number,
    title: String,
    description: String,
    rating: Number,
    likesCount: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    photos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'photo'
    }],
    isPublished: Number
});

module.exports = mongoose.model('quest', questSchema);
