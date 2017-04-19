const QuestFilter = require('../../view_models/quest-filter');
let questFilter = new QuestFilter();

exports.indexCtrl = (req, res) => {
    res.render('main-page', {
        filter: questFilter.toJson()
    });
};

exports.ratingCtrl = (req, res) => {
    res.render('ratings-page');
};
