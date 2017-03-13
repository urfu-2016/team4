'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* eslint new-cap: 0 */
<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
const userSchema = new Schema({
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
=======
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
>>>>>>> настроила тесты
});

module.exports = mongoose.model('user', userSchema);
