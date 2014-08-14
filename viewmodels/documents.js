/*jshint -W033 */
var DocumentManager = require('document/DocumentManager'),
    fs = require("fileSystemImpl");

define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        config = require('../config'),
        $DocumentManager = $(DocumentManager);
    
    function DocumentsViewModel(){
        var self = this;
        this.documents = ko.observableArray([]);
        this.selected = ko.observable(null);

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

        this.onDocumentAdd = function(){
            fs.showOpenDialog(false, false, 'Open File', config.path, null, function(err, files){
                if (err){
                    console.error(err);
                } else if (files.length === 0){
                    // no files selected
                    return;
                } else {
                    var filePath = files[0];
                    if (!filePath){
                        throw new Error('No file is selected')
                    }

                     DocumentManager.getDocumentForPath(filePath).done(function(doc){
                        if (doc){
                            DocumentManager.setCurrentDocument(doc);
                            self.documents.push(doc.file);
                            self.selected(doc.file);
                        }
                    });
                }
            })
        }

        $DocumentManager.on('workingSetAdd', function(event, file){
            self.documents.push(file);
        });

        $DocumentManager.on('workingSetRemove', function(event, file){
            self.documents.remove(file);
        });

        $DocumentManager.on('currentDocumentChange', function(event, newDocument){
            if (!newDocument){
                return;
            }
            self.selected(newDocument.file);
        });

        $DocumentManager.on('workingSetAddList', function(event, files){
            _.each(files, function(file){
                self.documents.push(file);
            });
        });

        $DocumentManager.on('workingSetRemoveList', function(event, files){
            _.each(files, function(file){
                self.documents.remove(file);
            });
        });

        $DocumentManager.on('fileNameChange', _.bind(this.handlePathChanges, this));

        $DocumentManager.on('pathDeleted', _.bind(this.handlePathChanges, this));
    }

    DocumentsViewModel.prototype.handlePathChanges = function(){
        this.documents([]);
        this.selected(null);

        this.documents(this.getWorkingSet());
        this.selected(this.getCurrentDocument());
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
