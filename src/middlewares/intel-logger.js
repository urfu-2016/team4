let intel = require('intel');
exports.init = () => {
    intel.basicConfig({
        file: './logs.log',
        format: '%(date)s: %(name)s.%(levelname)s:: %(message)s',
        level: intel.WARN
    });
    intel.warn('Запуск');
};
