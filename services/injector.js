define(function(require, exports){
    var $ = window.jQuery,
        ko = require('../vendor/knockout'),
        DocumentsViewModel = require('../viewmodels/documents'),
        parentSelector = '.content #first-pane',
        openFilesSelector = '#open-files-container',
        template = require('text!../templates/holder.html');
    
    exports.init = function(){
        var $holder = $(template);
        
        $holder.css('background', $(openFilesSelector).css('background'));
        
        $(parentSelector).prepend($holder);
        
        ko.applyBindings(new DocumentsViewModel($holder), $holder[0]);
    };
});
