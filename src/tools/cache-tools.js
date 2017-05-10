const cachegoose = require('cachegoose');

function getCacheKey(prefix, user) {
    let userId = 'all';
    if (user) {
        userId = user.id ? user.id : user;
    }

    return prefix + '-' + String(userId);
}

exports.getCacheKey = getCacheKey;

exports.clearCache = (prefix, user) => {
    cachegoose.clearCache(getCacheKey(prefix, user));
};
