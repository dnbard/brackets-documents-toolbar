define(function(require, exports){
    var ko = require('../vendor/knockout'),
        colorPickerTemplate = require('text!../templates/colorPicker.html');

    require('../vendor/jquery.tinycolorpicker');

    ko.bindingHandlers.colorpicker = {
        init: function(element, valueAccessor){
            var $el = $(element);

            function onChange(event, color){
                var value = valueAccessor();
                value(color);
            }

            $el.append(colorPickerTemplate);
            $el.tinycolorpicker();

            $el.on('change', onChange);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
                var $el = $(element);
                $el.off('change');

                //TODO: dispose the instance of tinycolorpicker
            });
        },
        update: function(element, valueAccessor){
            //setTimeout(function(){
                $(element).find('.colorInner')
                    .css('background-color', ko.unwrap(valueAccessor()));
            //}, 0);
        }
    };
});
