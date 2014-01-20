var fs = require('fs'),
    luster = require('luster'),
    logger = require('./logger')(module),
    config = require('./config');

if (luster.isMaster) {
    var socket = config.get('app:socket');

    if (socket) {
        try {
            fs.unlinkSync(socket);
        } catch (e) {}
    }

    luster.registerRemoteCommand('reload', function(sender, value) {
        logger.info('master receive message reload from sender %s with value %s', sender.wid, value);
        luster.forEach(function(worker) {
            worker.remoteCall('reloadCache', sender.id, value);
        });
    });
    luster.registerRemoteCommand('request', function(sender, value) {
        logger.debug('master receive message request from sender %s with value %s', sender.wid, value);
    });

    logger.info('start cluster master process');
}

luster.configure({
    app: './cluster/worker.js',
    workers: config.get('luster:workers'),
    control: config.get('luster:control'),
    server: config.get('luster:server')
}, true, __dirname).run();
