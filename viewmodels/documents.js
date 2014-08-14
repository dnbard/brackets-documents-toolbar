/*jshint -W033 */
var DocumentManager = require('document/DocumentManager');

define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        AppInit = brackets.getModule('utils/AppInit');
    
    function DocumentsViewModel(){
        var self = this;
        this.documents = ko.observableArray([]);
        this.selected = ko.observable(null);
        
        function onTimeHandler(){
            self.documents(self.getWorkingSet());
            self.selected(self.getCurrentDocument());
            setTimeout(onTimeHandler, 1000);
        }

        this.onDocumentClick = function(model){
            DocumentManager.getDocumentForPath(model._path)
                .done(function(doc){
                    if (doc){
                        DocumentManager.setCurrentDocument(doc);
                        self.selected(doc.file);
                    }
                });
        }

        this.onDocumentClose = function(file, event){
            DocumentManager.removeFromWorkingSet(file, false);
            self.documents.remove(file);

            event.stopPropagation();
        }

        AppInit.appReady(onTimeHandler);
    }
    
    DocumentsViewModel.prototype.getWorkingSet = function(){
        return DocumentManager.getWorkingSet();
    }
    
    DocumentsViewModel.prototype.getCurrentDocument = function(){
        var document = DocumentManager.getCurrentDocument();
        
        if (document && typeof document === 'object'){
            return document.file;
        }
        return null;
    }
    
    module.exports = DocumentsViewModel;
});
