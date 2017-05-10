let intel = require('intel');
intel.basicConfig({
    file: './log/logs.log',
    format: '%(date)s: %(name)s.%(levelname)s:: %(message)s',
    level: intel.WARN
});
intel.warn('Запуск');

