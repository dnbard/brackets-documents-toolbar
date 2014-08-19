define(function(require, exports){
    var ko = require('../vendor/knockout');

    require('../vendor/jquery.tinycolorpicker');

    function init(el){
        el.append('<a class="color"><div class="colorInner"></div></a><div class="track" style="display: none;"><canvas width="150" height="150"></canvas></div><ul class="dropdown"></ul><input type="hidden" class="colorInput">');
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
