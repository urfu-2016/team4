const Filter = require('./filter');

class QuestFilter extends Filter {
    constructor() {
        super();
        super.addOption('Quest__rating', 'По рейтингу');
        super.addOption('Quest__likesCount', 'По лайкам');
        super.addOption('Quest__title', 'По названию');
        super.addOption('Author__name', 'По автору');
    }
}

module.exports = QuestFilter;
