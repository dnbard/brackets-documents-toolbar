define(function(require, exports){
    var $ = window.jQuery,
        ko = require('../vendor/knockout'),
        DocumentsViewModel = require('../viewmodels/documents'),
        firstPanelSelector = '.content #first-pane',
        secondPanelSelector = '.content #second-pane',
        openFilesSelector = '#open-files-container',
        template = require('text!../templates/holder.html'),
        MainViewManager = brackets.getModule('view/MainViewManager'),
        panelContentProvider = require('./panels');
    
    exports.init = function(){
        var $holder = $(template),
            vm = new DocumentsViewModel($holder, 'first-pane');
        $holder.css('background', $(openFilesSelector).css('background'));
        $(firstPanelSelector).prepend($holder);
        ko.applyBindings(vm, $holder[0]);

        panelContentProvider.register(vm, 'first-pane');
        
        MainViewManager.on('paneCreate', function(){
            var $holder = $(template),
                vm = new DocumentsViewModel($holder, 'second-pane');
            $holder.css('background', $(openFilesSelector).css('background'));
            $(secondPanelSelector).prepend($holder);
            ko.applyBindings(vm, $holder[0]);

            panelContentProvider.register(vm, 'second-pane');
        });

        MainViewManager.on('paneDestroy', function(){
            var vm = panelContentProvider.remove('second-pane');
            if (typeof vm.dispose === 'function'){
                vm.dispose();
            }
        })
    };
});
