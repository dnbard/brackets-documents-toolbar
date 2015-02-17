define(function(require){
    var ko = require('../vendor/knockout');

    ko.bindingHandlers.editableText = {
        init: function(element, valueAccessor) {
            function onBlur(){
                var observable = valueAccessor();
                observable( $(this).text() );
            }

            $(element).on('blur', onBlur);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
                $(element).off('blur', onBlur);
            });
        },
        update: function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).text(value);
        }
    };
});
