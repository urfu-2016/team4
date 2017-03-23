/**
 * парсит поля вида Model__key = value
 * и Model__value__modification = value
 * и пихает в data.find
 *
 * @param key - поле объекта для применения матчинга
 * @param queryQueue - очередь модификаторов (include, gt, gte и пр.)
 * @param data - результирующий объект для parseData
 * @param value - значение опции
 */
function parseField(key, queryQueue, data, value) {
    key = key.replace(/_/g, '.');
    if (!queryQueue.length) {
        data.find[key] = value;

        return;
    }

    let subKey = queryQueue.shift();
    if (subKey === 'include') {
        data.find[key] = new RegExp('.*' + value + '.*');
    } else {
        data.find[key] = {};
        data.find[key]['$' + subKey] = value;
    }
}

/**
 * парсит поля вида Model__opt__option__key = value
 * и Model__opt__option = value
 * и пихает в data.options
 *
 * @param opt - тип опции (limit, sort и тд)
 * @param key - поле объекта для применения опции
 * @param value - значение опции
 * @param data - результирующий объект для parseData
 */
function parseOption(opt, key, value, data) {
    if (!key) {
        data.options[opt] = Number(value);

        return;
    }
    if (!(opt in data.options)) {
        data.options[opt] = {};
    }
    data.options[opt][key] = Number(-1 * value);
}

/**
 *
 * @param query - входящая response query
 * @param prefix - модель к которй применяется опция
 * @returns {{find: {}, options: {}}}
 *
 */
function parseData(query, prefix) {
    let data = {
        find: {},
        options: {}
    };
    Object.keys(query).filter(key => {
        return key.startsWith(prefix);
    }).forEach(key => {
        let queryQueue = key.split('__');
        queryQueue.shift();
        let subKey = queryQueue.shift();
        if (subKey === 'opt') {
            parseOption(queryQueue.shift(), queryQueue.shift(), query[key], data);
        } else {
            parseField(subKey, queryQueue, data, query[key]);
        }
    });

    return data;
}
/**
 * парсит response query удобным для монги образом
 *
 * @param query - входящая response query
 * @returns Object - объект распаршенный для mongoose
 */
module.exports = query => {
    const data = {};
    Object.keys(query).forEach(key => {
        let prefix = key.split('__')[0];
        if (!(prefix in data)) {
            data[prefix] = parseData(query, prefix);
        }
    });

    return data;
};
