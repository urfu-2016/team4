module.exports = class Filter {
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

    handle(value, data, opts) {
        opts = opts || {};
        value = value || this._opts[0].value;
        if (!(value in this._handlers)) {
            return data;
        }
        this._handlers[value].forEach(handler => {
            data = handler(data, opts);
        });

        return data;
    }
};
