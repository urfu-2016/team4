'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const userSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    vkId: Number,
    name: {
        type: String,
        required: true
    },
    rating: Number,
    photoURL: String,
    quests: [{
        quest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'quest'
        },
        progress: Number,
        checkPhotos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'photo'
        }],
        isAuthor: Number
    }],
    likeQuests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quest'
    }]
});

module.exports = mongoose.model('user', userSchema);

userSchema.plugin(autoIncrement.plugin, {model: 'User', field: 'id'});
module.exports = mongoose.connection.model('User', userSchema);
