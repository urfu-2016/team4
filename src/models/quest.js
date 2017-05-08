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

/**
 * данный метод вызывается у экземпляров Quest
 * он расширяет поля квеста, добавляя progress.
 * @param user - экземпляр модели User из request
 * @return Object - json квеста с полем progress
 */
questSchema.methods.wrapForUser = function (user) {
    this.user = user;
    let wrapper = JSON.parse(JSON.stringify(this));
    let userQuests = [];
    if (user) {
        userQuests = user.quests.map(wrapper => {
            if ('_id' in wrapper.quest) {
                return String(wrapper.quest._id);
            }

            return String(wrapper.quest);
        });
    }
    let indexOfQuest = userQuests.indexOf(String(this._id));
    if (user && indexOfQuest > -1 && !user.quests[indexOfQuest].isAuthor) {
        wrapper.progress = user.quests[indexOfQuest].progress;
    } else {
        wrapper.progress = undefined;
    }

    return wrapper;
};

module.exports = mongoose.model('quest', questSchema);

