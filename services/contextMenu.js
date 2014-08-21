var CommandMenus = require('command/Menus'),
    CommandManager = require('command/CommandManager'),
    ProjectManager = require('project/ProjectManager');

define(function(require, exports, module){
    var instance = new ContextMenuService(),
        _ = require('../vendor/lodash'),
        storage = require('./storage'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        storageRulesKey = 'rules';

    function ContextMenuService(){
        var ModalService = require('./modal'),
            self = this,
            contextMenuId = 'document-context_menu';

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

        this.clearRuleCommand = CommandManager.register('Clear custom colors', 'dte_clearRule', function(){
            var colorRules = storage.getKey(storageRulesKey) || {};

            _.remove(colorRules, self.ruleHandler);

            storage.setKey(storageRulesKey, colorRules);
            $(DocumentManager).trigger('workingSetSort');
        });

        this.addNewRuleCommand = CommandManager.register('!', 'dte_addRule', function(){
            var viewModel = ModalService.showHandler();
            viewModel.getOrCreateRule(self.context._name);
        });

        this.menu.addMenuItem(this.addNewRuleCommand);
        this.menu.addMenuItem(this.clearRuleCommand);

    }

    ContextMenuService.prototype.open = function(context, event){
        this.menu.removeMenuItem(this.clearRuleCommand);
        this.context = context;

        var colorRules = storage.getKey(storageRulesKey) || {};

        if (_.find(colorRules, this.ruleHandler)){
            this.menu.addMenuItem(this.clearRuleCommand);
            this.addNewRuleCommand.setName('Change tab colors');
        } else {
            this.addNewRuleCommand.setName('Set tab colors');
        }

        this.menu.open(event);
    }

    module.exports = instance;
});
