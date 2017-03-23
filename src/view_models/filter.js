class Filter {
    constructor() {
        this._opts = [];
        this._handlers = {};
    }

    addOption(value, text, handlers) {
        this._opts.push({value: value, text: text});
        this._handlers[value] = handlers;
    }

    toJson() {
        return this._opts;
    }
}

module.exports = Filter;
