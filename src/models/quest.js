/**
 * Created by trefi on 12.03.2017.
 */

'use strict';

const mongoose = require('mongoose');

const questSchema = mongoose.Schema({
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

module.exports  = mongoose.model('quest', questSchema);
