define(function(require, exports){
    var ko = require('../vendor/knockout');

    ko.bindingHandlers.fade = {
        init: function(element, valueAccessor) {
            var value = valueAccessor();
            if (typeof value === 'function'){
                value = value();
            }

            $(element).toggle(ko.unwrap(value));
        },
        update: function(element, valueAccessor) {
            var value = valueAccessor();
            value = ko.unwrap(value);

            if (typeof value === 'function'){
                value = value();
            }

            if (value){
                $(element).fadeIn();
            }
            else {
                $(element).fadeOut();
            }
        }
    };
});
