var CommandMenus = require('command/Menus'),
    CommandManager = require('command/CommandManager'),
    ProjectManager = require('project/ProjectManager'),
    MainViewManager = require('view/MainViewManager'),
    AppInit = require('utils/AppInit');

define(function(require, exports, module){
    var instance = new ContextMenuService(),
        _ = require('../vendor/lodash'),
        storage = require('./storage'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        storageRulesKey = 'rules';

    function ContextMenuService(){
        var ModalService = require('./modal'),
            self = this,
            contextMenuId = 'document-context_menu',
            FileTransfer = require('./fileTransfer'),
            panelContentProvider = require('./panels');

        this.context = null;

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

        this.clearRuleCommand = CommandManager.register('Clear custom colors', 'dte_clearRule', function(){
            var colorRules = storage.getKey(storageRulesKey) || {};

            _.remove(colorRules, self.ruleHandler);

            storage.setKey(storageRulesKey, colorRules);
            $(MainViewManager).trigger('workingSetSort');
        });

        this.moveToOtherPanel = CommandManager.register('Move to another panel', 'dte_moveToAnotherPanel', function(){
            //NOT IMPLEMENTED YET UNTIL BRACKETS PANEL API WILL BE USABLE
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
                self.menu.addMenuItem(self.addNewRuleCommand);
                self.menu.addMenuItem(self.clearRuleCommand);
            }, 100);
        });

    }

    ContextMenuService.prototype.open = function(context, event){
        var self = this;

        this.menu.removeMenuItem(this.clearRuleCommand);
        this.context = context;

        var colorRules = storage.getKey(storageRulesKey) || {};

        if (_.find(colorRules, this.ruleHandler)){
            this.menu.addMenuItem(this.clearRuleCommand);
            this.addNewRuleCommand.setName('Change tab colors');
        } else {
            this.addNewRuleCommand.setName('Set tab colors');
        }

        setTimeout(function(){
            self.menu.open(event);
        }, 10);
    }

    module.exports = instance;
});
