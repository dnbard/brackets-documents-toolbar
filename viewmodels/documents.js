var fs = require("fileSystemImpl");

define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        Icons = require('../services/icons'),
        config = require('../config'),
        prefs = require('../services/preferences'),
        ModalService = require('../services/modal'),
        storage = require('../services/storage'),
        contextMenu = require('../services/contextMenu'),
        closedDocumentsCollection = require('../services/closedDocuments'),
        KeyBindingManager = brackets.getModule('command/KeyBindingManager'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        MainViewManager = brackets.getModule('view/MainViewManager'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        CommandManager = brackets.getModule('command/CommandManager');
    
    function DocumentsViewModel(element, panelId){
        var self = this;

        this.element = element;
        this.panelId = panelId;
        this.documents = ko.observableArray([]);
        this.selected = ko.observable(null);
        this.selectedPath = ko.computed(function(){
            return this.selected() ? this.selected()._path : '';
        }, this);
        this.changed = ko.observableArray([]);
        this.modified = ko.observableArray([]);

        this.locked = ko.observableArray([]);

        DocumentManager.on('dte_lockStatusUpdated', function(event, data){
            var documentInList = !!_.find(self.locked(), function(lockedDocumentPath){
                return lockedDocumentPath === data.path;
            });

            if (data.status === 'locked' && !documentInList){
                self.locked.push(data.path);
            }

            if (data.status === 'unlocked' && documentInList){
                self.locked.remove(function(lockedDocumentPath){
                    return lockedDocumentPath === data.path;
                });
            }
        });

        this.isDocumentLocked = function(data){
            return !!_.find(self.locked(), function(lockedDocumentPath){
                return lockedDocumentPath === data._path;
            });
        }

        this.iconsEnabled = ko.observable(prefs.get('icons'));
        prefs.notifier('icons', function(value){
            self.iconsEnabled(value);
        });

        this.fontEnabled = ko.observable(prefs.get('brackets_font'));
        prefs.notifier('brackets_font', function(value){
            self.fontEnabled(value);
        });

        this.isShowCloseButtonOnTabs = ko.observable(!!prefs.get('showCloseButton'));

        this.onDocumentClick = function(model, event){
            CommandManager.execute('file.open', {
                fullPath: model._path
            }).always(function(){
                MainViewManager.focusActivePane();
            });
        }

        this.showContextMenu = ko.observable(false);
        this.onDocumentContextMenu = function(context, event){
            self.onDocumentClick(context, event);

            contextMenu.open(context, event);
        }

        this.onDocumentMouseDown = function(file, event){
            if (event.which === 2){
                //middle button pressed
                self.onDocumentClose(file, event);
                return false;
            }

            return true;
        }

        this.onDocumentClose = function(file){
            if (!!_.find(self.locked(), function(lockedDocumentPath){
                return lockedDocumentPath === file._path;
            })){
                return false;
            }

            CommandManager.execute('file.close', {
                file: file,
                paneId: this.panelId
            });
        }

        KeyBindingManager.addBinding(CommandManager.register('Reopen document', 'dt.reopenDocument', function(){
            var lastDocument = closedDocumentsCollection.get();

            if (lastDocument === null){
                return;
            }

            DocumentManager.getDocumentForPath(lastDocument.path).done(function(doc){
                if (doc){
                    DocumentManager.setCurrentDocument(doc);
                    if (!_.find(self.documents(), function(file){
                        return file === doc.file;
                    })){
                        DocumentManager.addToWorkingSet(doc.file, -1);
                    }
                    self.selected(doc.file);
                }
            });
        }), 'Ctrl-Shift-T');

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
                                DocumentManager.addToWorkingSet(doc.file, -1);
                            }
                            self.selected(doc.file);
                        }
                    });
                }
            })
        }

        this.onDocumentCloseAll = function(){
            DocumentManager.closeAll();
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

        this.isModified = function(doc){
            return !!_.find(self.modified(), function(modified){
                return modified.name === doc._name && doc._path.indexOf(modified.file) >= 0;
            });
        }

        this.addDocument = function(doc){
            this.documents.push(doc);
        }

        this.removeDocument = function(doc){
            self.documents.remove(function(el){
                return el._path === doc._path;
            });
        }

        this.tooltip = ko.observable(null);

        var hoveredDocument = null;
        this.onDocumentMouseIn = function(document, event){
            self.isShowCloseButtonOnTabs(!!prefs.get('showCloseButton'));

            if (!prefs.get('tooltip')){
                return;
            }

            hoveredDocument = document;
            setTimeout(function(){
                if (hoveredDocument === document){
                    hoveredDocument = null;
                    self.tooltip({
                        type: 'file',
                        data: document,
                        event: event
                    });
                }
            }, 1);
        }

        this.onDocumentMouseLeave = function(){
            hoveredDocument = null;
            self.tooltip(null);
        }

        this.getRelativePath = function(file){
            var path = ProjectManager.getProjectRoot()._path;
            if (!file || !file._path){
                return '';
            }

            return file._path.replace(path, './');
        }

        this.getCurrentProjectName = function(){
            return ProjectManager.getProjectRoot()._name;
        }

        this.getTooltipPosition = function(tooltip){
            var $target = $(tooltip.event.target);
            if (!$target.hasClass('document')){
                if ($target.hasClass('fa')){
                    return tooltip.event.target.parentNode.parentNode.offsetLeft + 'px'
                }
                return tooltip.event.target.parentNode.offsetLeft + 'px'
            }
            return tooltip.event.target.offsetLeft + 'px';
        }

        this.getDocumentName = function(file){
            var fileName = file._name,
                projectPath,
                result;

            if (_.filter(this.allFileNames(), function(el){
                return el === fileName
            }).length > 1){
                projectPath = ProjectManager.getProjectRoot()._path;
                result = file._path.replace(projectPath, '');

                if (result.length > 49){
                    result = fileName;
                }

                return result;
            } else {
                return fileName;
            }
        }

        this.allFileNames = ko.computed(function(){
            var fileNames = [];

            _.each(this.documents(), function(document){
                fileNames.push(document._name);
            });

            return fileNames;
        }, this);

        this.onShowOptions = function(){
            ModalService.showHandler();
        }

        this.filterCustomRules = function(file){
            var rules = storage.getKey('rules') || {};

            return _.find(rules, function(rule){
                var query = rule.name.replace('*', ''),
                    currentProject, filterByFile, filterByRegex,
                    flags, pattern, regex;

                if (rule.project){
                    currentProject = self.getCurrentProjectName();
                    if (rule.project !== currentProject){
                        return false;
                    }
                }

                filterByFile = file._name.indexOf(query) >= 0;

                if (query.indexOf('/') !== -1){
                    flags = query.replace(/.*\/([gimy]*)$/, '$1');
                    pattern = query.replace(new RegExp('^/(.*?)/'+flags+'$'), '$1');
                    regex = new RegExp(pattern, flags);
                    filterByRegex = !!file._parentPath.match(regex) || !!file._name.match(regex);
                } else {
                    filterByRegex = false;
                }

                return filterByFile || filterByRegex;
            });
        }

        this.getDocumentBackground = function(file){
            var rule = this.filterCustomRules(file);

            if (rule){
                return rule.background;
            }
            return 'inherited';
        }

        this.getDocumentBorder = function(file){
            var rule = this.filterCustomRules(file);

            if (rule && file !== self.selected()){
                return rule.background;
            }
            return 'inherited';
        }

        this.getDocumentNameColor = function(file){
            var rule = this.filterCustomRules(file);

            if (rule){
                return rule.color;
            }
            return 'inherited';
        }

        this.isCloseOnLeft = function(){
            return prefs.get('close_left');
        }

        this.getDocumentView = function(document){
            var path = document._path,
                name = document._name,
                workingPanelSelector = panelId === 'first-pane'? '#working-set-list-first-pane' : '#working-set-list-second-pane',
                workingPanel = $(workingPanelSelector),
                fileViews = workingPanel.find('ul > li'),
                documentIndex = MainViewManager.findInAllWorkingSets(path)[0].index;

            return $(fileViews[documentIndex]).find('a').html();
        }

        MainViewManager.on('workingSetAdd', function(event, file, index, panel){
            if (self.panelId !== panel){
                return;
            }
            self.addDocument(file);
        });

        MainViewManager.on('workingSetRemove', function(event, file){
            self.removeDocument(file);
        });

        MainViewManager.on('workingSetMove', function(e, file, sourcePaneId, destinationPaneId){
            if (self.panelId === sourcePaneId){
                self.removeDocument(file);
            }

            if (self.panelId === destinationPaneId){
                self.addDocument(file);
            }
        });

        EditorManager.on('activeEditorChange', function(event, focusedEditor){
            if (!focusedEditor){
                return;
            }

            var newDocument = focusedEditor.document;

            if (!newDocument){
                return;
            }
            self.selected(newDocument.file);
        });

        MainViewManager.on('workingSetAddList', function(event, files, panel){
            if (self.panelId !== panel){
                return;
            }
            _.each(files, function(file){
                self.addDocument(file);
            });
        });

        MainViewManager.on('workingSetRemoveList', function(event, files){
            _.each(files, function(file){
                self.removeDocument(file);
            });
        });

        DocumentManager.on('fileNameChange', _.bind(this.handlePathChanges, this));

        DocumentManager.on('pathDeleted', _.bind(this.handlePathChanges, this));

        MainViewManager.on('workingSetSort', _.bind(this.handlePathChanges, this));
        MainViewManager.on('workingSetUpdate', _.bind(this.handlePathChanges, this));

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

        DocumentManager.on('dirtyFlagChange', this.isDocumentChanged);

        DocumentManager.on('documentSaved', this.isDocumentChanged);

        // look for brackets-git and attach handlers for its events
        if (typeof window === 'object') {
            var attachHookOnBracketsGit = function() {
                var bGit = window.bracketsGit;
                bGit.EventEmitter.on(bGit.Events.GIT_STATUS_RESULTS, function (results) {
                    self.modified(results);
                });
            };

            var attempts = 0,
                maxAttempts = 10;

            var lookForBracketsGit = function() {
                attempts++;
                if (window.bracketsGit) {
                    attachHookOnBracketsGit();
                } else {
                    if (attempts < maxAttempts) {
                        window.setTimeout(lookForBracketsGit, 1000);
                    } else {
                        console.log('Download the Brackets Git for a better development experience: https://github.com/zaggino/brackets-git');
                    }
                }
            }
            lookForBracketsGit();
        }
    }

    DocumentsViewModel.prototype.handlePathChanges = function(){
        this.documents([]);
        this.selected(null);

        this.documents(this.getWorkingSet());
        this.selected(this.getCurrentDocument());
    }
    
    DocumentsViewModel.prototype.getWorkingSet = function(){
        return MainViewManager.getWorkingSet(this.panelId);
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
