/**
 * Created by trefi on 12.03.2017.
 */

'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    id: Number,
    name: String,
    password: String,
    rating: Number,
    photoURL: String,
    quests: [{
        questId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'quest'
        },
        progress: Number,
        checkPhotos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'photo'
        }],
        whoAmI: Number
    }],
    likeQuests: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'quest'
    }]
});

var user = mongoose.model('quest', userSchema);

module.exports = user;
