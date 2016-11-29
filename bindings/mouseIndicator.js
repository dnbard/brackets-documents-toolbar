define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        indicators = {},
        handlers = {};


    ko.bindingHandlers.mouseIndicator = {
        init: function(element) {
            var id = element.id,
                $element = $(element);
            indicators[id] = false;

            function onMouseEnter(){
                var id = element.id;
                indicators[id] = true;
            }

            function onMouseLeave(){
                var id = element.id;
                indicators[id] = false;

                if (handlers[id]){
                    setTimeout(function(){
                        var tabResizer = require('../services/tabSize');
                        tabResizer.sizeHandler(true);
                        handlers[id] = null;
                    }, 250);
                }
            }

            $element.on('mouseenter', onMouseEnter);
            $element.on('mouseleave', onMouseLeave);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
                $element.off('mouseenter', onMouseEnter);
                $element.off('mouseleave', onMouseLeave);
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
