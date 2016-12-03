define(function(require){
    var ko = require('../vendor/knockout'),
        localization = require('../services/localization');

    ko.bindingHandlers.locale = {
        update: function(element, valueAccessor) {
            var value = valueAccessor();
            value = ko.unwrap(value);

            $(element).text(localization.get(value));
        }
    };
});
