define(function(require){
    var ko = require('../vendor/knockout');

    ko.bindingHandlers.editableText = {
        init: function(element, valueAccessor) {
            $(element).on('blur', function() {
                var observable = valueAccessor();
                observable( $(this).text() );
            });
        },
        update: function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).text(value);
        }
    };
});
