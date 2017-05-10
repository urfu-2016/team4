
/**
 * данный метод вызывается у экземпляров Quest
 * он расширяет поля квеста, добавляя progress.
 * @param user - экземпляр модели User из request
 * @return Object - json квеста с полем progress
 */
exports.wrapForUser = function (quest, user) {
    quest.user = user;
    // let wrapper = JSON.parse(JSON.stringify(this));
    let userQuests = [];
    if (user) {
        userQuests = user.quests.map(wrapper => {
            if ('_id' in wrapper.quest) {
                return String(wrapper.quest._id);
            }

            return String(wrapper.quest);
        });
    }
    let indexOfQuest = userQuests.indexOf(String(quest._id));

    if (user && indexOfQuest > -1 && !user.quests[indexOfQuest].isAuthor) {
        quest.progress = user.quests[indexOfQuest].progress;
    } else {
        quest.progress = undefined;
    }

    return quest;
};
