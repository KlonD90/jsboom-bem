var intel = require('intel');

modules.define('logger', ['config'], function(provide, config) {

    //set logger verbosity level from configuration file
    intel.setLevel(config.get('app:logger:level'));

    //add console logger handler
    intel.addHandler(
        new intel.handlers.Console({
            level: intel.VERBOSE,
            formatter: new intel.Formatter({
                format: '[%(date)s] %(levelname)s %(name)s: %(message)s',
                colorize: true
            })
        })
    );

    //add file logger handler
    intel.addHandler(
        new intel.handlers.File({
            file: config.get('app:logger:stdout'),
            level: intel.INFO,
            formatter: new intel.Formatter({
                format: '[%(date)s] %(levelname)s %(name)s: %(message)s',
                colorize: true
            })
        })
    );

    provide(function(module) {
        var name = module ? module.filename.split('/').slice(-2).join('/') : '';
        return intel.getLogger(name);
    });
});
