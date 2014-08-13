/*jshint -W033 */
var DocumentManager = require('document/DocumentManager');

define(function(require, exports, module){
    var ko = require('../vendor/knockout');
    
    function DocumentsViewModel(){
        var self = this;
        this.documents = ko.observableArray([]);
        this.selected = ko.observable(null);
        
        setTimeout(function(){
            self.documents(self.getWorkingSet());
            self.selected(self.getCurrentDocument());
        }, 2000);
    }
    
    DocumentsViewModel.prototype.getWorkingSet = function(){
        return DocumentManager.getWorkingSet();
    }
    
    DocumentsViewModel.prototype.getCurrentDocument = function(){
        var document = DocumentManager.getCurrentDocument();
        
        if (typeof document === 'object'){
            return document._file;
        }
        return null;
    }
    
    module.exports = DocumentsViewModel;
});