define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        indicators = {},
        handlers = {};


    ko.bindingHandlers.mouseIndicator = {
        init: function(element) {
            var id = element.id;
            indicators[id] = false;

            $(element).on('mouseenter', function(){
                var id = element.id;
                indicators[id] = true;
            });

            $(element).on('mouseleave', function(){
                var id = element.id;
                indicators[id] = false;

                if (handlers[id]){
                    setTimeout(function(){
                        var tabResizer = require('../services/tabSize');
                        tabResizer.tabResizeWorker(false);
                        handlers[id] = null;
                    }, 250);
                }
            });
        }
    };

    exports.check = function(id){
        if (typeof id !== 'string'){
            throw new Error('Invalid argument');
        }

        return indicators[id];
    };

    exports.setHandler = function(id){
        if (typeof id !== 'string'){
            throw new Error('Invalid argument');
        }

        handlers[id] = true;
    };
});
