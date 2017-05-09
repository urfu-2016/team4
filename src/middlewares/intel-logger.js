let intel = require('intel');
intel.basicConfig({
    file: './log/logs.log',
    format: '%(date)s: %(name)s.%(levelname)s:: %(message)s',
    level: intel.WARN
});
intel.info('going to a file!');
intel.warn('i made it!');
intel.debug('nobody loves me');
