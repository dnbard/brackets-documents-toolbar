/*jshint -W033 */
var DocumentManager = require('document/DocumentManager'),
    fs = require("fileSystemImpl");

define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        Icons = require('../services/icons'),
        config = require('../config'),
        $DocumentManager = $(DocumentManager),
        prefs = require('../services/preferences');
    
    function DocumentsViewModel(){
        var self = this;
        this.documents = ko.observableArray([]);
        this.selected = ko.observable(null);
        this.selectedPath = ko.computed(function(){
            return this.selected() ? this.selected()._path : '';
        }, this);
        this.changed = ko.observableArray([]);

        this.iconsEnabled = ko.observable(prefs.get('icons'));

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
            self.removeDocument(file);

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
                            if (!_.find(self.documents(), function(file){
                                return file === doc.file;
                            })){
                                self.addDocument(doc.file);
                            }
                            self.selected(doc.file);
                        }
                    });
                }
            })
        }

        this.isDocumentSelected = function(model){
            if (self.selected() === null){
                return false;
            }
            return self.selected()._path === model ? model._path : null;
        }

        this.isChanged = function(doc){
            return _.contains(self.changed(), doc._path);
        }

        this.addDocument = function(doc){
            this.documents.push(doc);
        }

        this.removeDocument = function(doc){
            self.documents.remove(function(el){
                return el._path === doc._path;
            });
        }

        $DocumentManager.on('workingSetAdd', function(event, file){
            self.addDocument(file);
        });

        $DocumentManager.on('workingSetRemove', function(event, file){
            self.removeDocument(file)
        });

        $DocumentManager.on('currentDocumentChange', function(event, newDocument){
            if (!newDocument){
                return;
            }
            self.selected(newDocument.file);
        });

        $DocumentManager.on('workingSetAddList', function(event, files){
            _.each(files, function(file){
                self.addDocument(file);
            });
        });

        $DocumentManager.on('workingSetRemoveList', function(event, files){
            _.each(files, function(file){
                self.removeDocument(file);
            });
        });

        $DocumentManager.on('fileNameChange', _.bind(this.handlePathChanges, this));

        $DocumentManager.on('pathDeleted', _.bind(this.handlePathChanges, this));

        this.isDocumentChanged = function(event, document){
            if (document.isDirty){
                if (_.contains(self.changed(), document.file._path)){
                    return;
                }
                self.changed.push(document.file._path);
            } else {
                self.changed.remove(document.file._path);
            }
        }

        $DocumentManager.on('dirtyFlagChange', this.isDocumentChanged);

        $DocumentManager.on('documentSaved', this.isDocumentChanged);
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
    
    DocumentsViewModel.prototype.getDocumentIcon = function(file){
        var name = file._name;
        return Icons.get(name);
    }

    DocumentsViewModel.prototype.getDocumentIconColor = function(file){
        var name = file._name;
        return Icons.color(name);
    }

    module.exports = DocumentsViewModel;
});
