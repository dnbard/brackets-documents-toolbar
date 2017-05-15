var CommandMenus = require('command/Menus'),
    CommandManager = require('command/CommandManager'),
    DocumentManager = require('document/DocumentManager'),
    AppInit = require('utils/AppInit');

define(function(require, exports, module){
    var instance = new ContextMenuService(),
        _ = require('../vendor/lodash'),
        storage = require('./storage'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        MainViewManager = brackets.getModule('view/MainViewManager'),
        closedDocumentsCollection = require('./closedDocuments'),
        storageRulesKey = 'rules';

    function ContextMenuService(){
        var ModalService = require('./modal'),
            self = this,
            contextMenuId = 'document-context_menu',
            FileTransfer = require('./fileTransfer'),
            panelContentProvider = require('./panels');

        this.context = null;
        this.localization = require('./localization'),

        this.menu = CommandMenus.registerContextMenu(contextMenuId);

        this.getCurrentProjectName = function(){
            return ProjectManager.getProjectRoot()._name;
        }

        this.ruleHandler = function(rule){
            var query = rule.name.replace('*', ''),
                currentProject;

            if (rule.project){
                currentProject = self.getCurrentProjectName();
                if (rule.project !== currentProject){
                    return false;
                }
            }

            return self.context._name.indexOf(query) >= 0;
        }

        this.addNewRuleCommand = CommandManager.register('!', 'dte_addRule', function(){
            var viewModel = ModalService.showHandler();
            viewModel.getOrCreateRule(self.context._name);
        });

        this.clearRuleCommand = CommandManager.register(this.localization.get('commandClearColors'), 'dte_clearRule', function(){
            var colorRules = storage.getKey(storageRulesKey) || {};

            _.remove(colorRules, self.ruleHandler);

            storage.setKey(storageRulesKey, colorRules);

            _.each(MainViewManager.getPaneIdList(), function(paneId){
                MainViewManager.trigger('workingSetUpdate', [null, paneId]);
            });
        });

        this.showOptionsCommand = CommandManager.register(this.localization.get('commandShowOptions'), 'dte_showOptions', function(){
            ModalService.showHandler();
        });

        this.lockedList = [];

        this.lockCommand = CommandManager.register(this.localization.get('commandLock'), 'dte_lockDocument', function(){
            DocumentManager.trigger('dte_lockStatusUpdated', {
                path: self.context._path,
                status: 'locked'
            });
        });

        this.unlockCommand = CommandManager.register(this.localization.get('commandUnlock'), 'dte_unlockDocument', function(){
            DocumentManager.trigger('dte_lockStatusUpdated', {
                path: self.context._path,
                status: 'unlocked'
            });
        });

        DocumentManager.on('dte_lockStatusUpdated', function(event, data){
            var documentInList = !!_.find(self.lockedList, function(lockedDocumentPath){
                return lockedDocumentPath === data.path;
            });

            if (data.status === 'locked' && !documentInList){
                self.lockedList.push(data.path);
            }

            if (data.status === 'unlocked' && documentInList){
                _.remove(self.lockedList, function(lockedDocumentPath){
                    return lockedDocumentPath === data.path;
                });
            }
        });

        this.moveToOtherPanel = CommandManager.register(this.localization.get('commandMoveToPanel'), 'dte_moveToAnotherPanel', function(){
            var file = self.context,
                fromPanel = panelContentProvider.isContain(file),
                toPanel = panelContentProvider.selectOtherPanel(fromPanel),
                fileTransfer = new FileTransfer(),
                panelLocation;

            if (!toPanel || fromPanel === toPanel ){
                return false;
            }

            panelLocation = MainViewManager.findInAllWorkingSets(file._path)[0];

            if (typeof panelLocation !== 'object'){
                return false;
            }

            fileTransfer.toAnotherPanel({
                fromPanel: fromPanel,
                toPanel: toPanel,
                file: file,
                fromIndex: panelLocation.index
            });
        });

        AppInit.appReady(function(){
            setTimeout(function(){
                self.menu.addMenuItem(CommandManager.get('file.saveAs'));
                self.menu.addMenuItem(CommandManager.get('file.save'));
                self.menu.addMenuItem(CommandManager.get('file.rename'));
                self.menu.addMenuItem(CommandManager.get('navigate.showInFileTree'));
                self.menu.addMenuItem(CommandManager.get('navigate.showInOS'));
                self.menu.addMenuDivider();
                self.menu.addMenuItem(CommandManager.get('cmd.findInSubtree'));
                self.menu.addMenuItem(CommandManager.get('cmd.replaceInSubtree'));
                self.menu.addMenuDivider();
                self.menu.addMenuItem(CommandManager.get('file.close'));
                self.menu.addMenuItem(CommandManager.get('file.close_above'));
                self.menu.addMenuItem(CommandManager.get('file.close_others'));
                self.menu.addMenuItem(CommandManager.get('file.close_below'));
                self.menu.addMenuDivider();

                if (CommandManager.get('git.addToIgnore')){
                    self.menu.addMenuItem(CommandManager.get('git.addToIgnore'));
                }

                if (CommandManager.get('git.removeFromIgnore')){
                    self.menu.addMenuItem(CommandManager.get('git.removeFromIgnore'));
                    self.menu.addMenuDivider();
                }

                self.menu.addMenuItem(self.moveToOtherPanel);
                self.menu.addMenuDivider();
                self.menu.addMenuItem(self.showOptionsCommand);
                self.menu.addMenuItem(self.addNewRuleCommand);
                self.menu.addMenuItem(self.clearRuleCommand);
            }, 100);
        });

    }

    ContextMenuService.prototype.open = function(context, event){
        var self = this,
            colorRules = storage.getKey(storageRulesKey) || {},
            reopenDocumentCommand = CommandManager.get('dt.reopenDocument');;

        this.menu.removeMenuItem(this.clearRuleCommand);
        this.context = context;

        if (_.find(colorRules, this.ruleHandler)){
            this.menu.addMenuItem(this.clearRuleCommand);
            this.addNewRuleCommand.setName(this.localization.get('commandChangeColors'));
        } else {
            this.addNewRuleCommand.setName(this.localization.get('commandSetColors'));
        }

        this.menu.removeMenuItem(reopenDocumentCommand);
        if (closedDocumentsCollection.size() !== 0){
            reopenDocumentCommand.setName(this.localization.get('reopen') + ' ' + closedDocumentsCollection.getName());
            this.menu.addMenuItem(reopenDocumentCommand, null, CommandMenus.AFTER, 'file.close_below');
        }

        if (!!_.find(self.lockedList, function(lockedDocumentPath){
            return lockedDocumentPath === context._path;
        })){
            this.menu.removeMenuItem(self.lockCommand);
            this.menu.addMenuItem(self.unlockCommand, null, CommandMenus.BEFORE, 'dte_showOptions');
        } else {
            this.menu.removeMenuItem(self.unlockCommand);
            this.menu.addMenuItem(self.lockCommand, null, CommandMenus.BEFORE, 'dte_showOptions');
        }

        setTimeout(function(){
            self.menu.open(event);
        }, 10);
    }

    module.exports = instance;
});
