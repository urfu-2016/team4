const Filter = require('./filter');

function questSortFunction(sort, quests, opts) {
    let sorted = quests;
    sorted.sort(sort);
    if (opts.reverse === 'true') {
        sorted.reverse();
    }

    return sorted;
}

function questFilterFunction(filter, quests, opts) {
    return quests.filter(filter.bind(null, opts));
}

function sortByName(a, b) {
    return a.title.localeCompare(b.title);
}

function sortByLikes(a, b) {
    return a.likesCount - b.likesCount;
}

function sortByRating(a, b) {
    return a.rating - b.rating;
}

function sortByAuthor(a, b) {
    return a.author.name.localeCompare(b.author.name);
}

function includeOptsPattern(data, opts) {
    if (!opts.include) {
        return true;
    }

    return String(data).toLowerCase().includes(opts.include.toLowerCase());
}

function filterByName(opts, quest) {
    return includeOptsPattern(quest.title, opts);
}

function filterByLikes(opts, quest) {
    return includeOptsPattern(quest.likesCount, opts);
}

function filterByRating(opts, quest) {
    return includeOptsPattern(quest.rating, opts);
}

function filterByAuthor(opts, quest) {
    return includeOptsPattern(quest.author.name, opts);
}

class QuestFilter extends Filter {
    constructor() {
        super();
        super.addOption('name', 'По названию', [
            questSortFunction.bind(null, sortByName),
            questFilterFunction.bind(null, filterByName)
        ]);
        super.addOption('like', 'По лайкам', [
            questSortFunction.bind(null, sortByLikes),
            questFilterFunction.bind(null, filterByLikes)
        ]);
        super.addOption('rating', 'По рейтингу', [
            questSortFunction.bind(null, sortByRating),
            questFilterFunction.bind(null, filterByRating)
        ]);
        super.addOption('author', 'По автору', [
            questSortFunction.bind(null, sortByAuthor),
            questFilterFunction.bind(null, filterByAuthor)
        ]);
    }
}

module.exports = QuestFilter;
