define(function(require, exports){
    var $ = window.jQuery,
        ko = require('../vendor/knockout'),
        DocumentsViewModel = require('../viewmodels/documents'),
        firstPanelSelector = '.content #first-pane',
        secondPanelSelector = '.content #second-pane',
        openFilesSelector = '#open-files-container',
        template = require('text!../templates/holder.html'),
        MainViewManager = brackets.getModule('view/MainViewManager'),
        $MainViewManager = $(MainViewManager);
    
    exports.init = function(){
        var $holder = $(template);
        $holder.css('background', $(openFilesSelector).css('background'));
        $(firstPanelSelector).prepend($holder);
        ko.applyBindings(new DocumentsViewModel($holder, 'first-pane'), $holder[0]);
        
        $MainViewManager.on('paneCreate', function(){
            var $holder = $(template);
            $holder.css('background', $(openFilesSelector).css('background'));
            $(secondPanelSelector).prepend($holder);
            ko.applyBindings(new DocumentsViewModel($holder, 'second-pane'), $holder[0]);
        });
    };
});
