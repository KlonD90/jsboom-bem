modules.define('i-bem__dom', ['jquery', 'zeroclipboard'], function(provide, $, zeroclipboard, BEMDOM) {

BEMDOM.decl('block-example', {

    onSetMod: {
        'js' : {
            'inited': function() {
                this.__base();

                this.setToClipboard();
            }
        }
    },

    setToClipboard: function() {
        var _this = this;

        ZeroClipboard.config({
            hoverClass: _this.params.copyHoverClass
        });

        var copy = new ZeroClipboard(_this.elem('source-copy'));

        copy.on('load', function(client) {

            client.on('dataRequested', function(client) {
                _this.getData(client);
            });

            client.on('complete', function() {
                _this.setMod(_this.elem('source-copy'), 'complete', 'yes');
                setTimeout(function() {
                    _this.delMod(_this.elem('source-copy'), 'complete');
                }, 1000);
            });

        });

        copy.on('noFlash wrongFlash', function() {
            _this.elem('source-copy').remove();
        });
    },

    getData: function(client) {
        var _this = this;

        $.ajax({
            url: _this.params.bemjsonUrl,
            success: function(content) {
                client.setText(content);
            },
            async: false
        });
    }

}, {});

provide(BEMDOM);

});