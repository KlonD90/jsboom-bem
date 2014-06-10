var path = require('path'),
    util = require('util'),

    YandexDisk = require('yandex-disk'),
    vow = require('vow');

modules.define('providerDisk', ['logger', 'config'], function(provide, logger, config) {

    logger = logger(module);

    var disk;

    provide({
        init: function() {
            disk = new YandexDisk.YandexDisk(
                config.get('common:yandexApi:login'),
                config.get('common:yandexApi:password')
            );
        },

        /**
         * Reads file from yandex disk
         * @param options - {Object} object with fields
         * - path {String} path to file
         * @returns {*}
         */
        load: function(options) {
            logger.debug('read file %s from yandex disk', options.path);

            var def = vow.defer();

            disk.readFile(options.path, 'utf8', function(err, content) {
                if(err || !content) {
                    def.reject(err);
                }

                def.resolve(content);
            });

            return def.promise();
        }
    })
});
