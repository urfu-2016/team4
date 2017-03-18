/**
 * Created by trefi on 12.03.2017.
 */

'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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

module.exports = mongoose.model('user', userSchema);
