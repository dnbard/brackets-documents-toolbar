define(function(require, exports){
    var ko = require('../vendor/knockout'),
        colorPickerTemplate = require('text!../templates/colorPicker.html');

    require('../vendor/jquery.tinycolorpicker');

    function init(el){
        el.append(colorPickerTemplate);
    }

    ko.bindingHandlers.colorpicker = {
        init: function(element, valueAccessor){
            var $el = $(element);
            init($el);

            $el.tinycolorpicker();

            setTimeout(function(){
                $el.find('.colorInner').css('background-color', ko.unwrap(valueAccessor()));
            }, 0);

            $el.bind("change", function(event, color){
                var value = valueAccessor();
                value(color);
            });
        }
    };
});
