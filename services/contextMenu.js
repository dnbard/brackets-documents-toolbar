var CommandMenus = require('command/Menus'),
    CommandManager = require('command/CommandManager');

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

        this.clearRuleCommand = CommandManager.register('Clear custom colors', 'dte_clearRule', function(){
            var colorRules = storage.getKey(storageRulesKey) || {};

            _.remove(colorRules, function(rule){
                return self.context._name.indexOf(rule.name) >= 0;
            });

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

        var colorRules = storage.getKey(storageRulesKey) || {};

        if (_.find(colorRules, function(rule){
            return context._name.indexOf(rule.name) >= 0;
        })){
            this.menu.addMenuItem(this.clearRuleCommand);
            this.addNewRuleCommand.setName('Change tab colors');
        } else {
            this.addNewRuleCommand.setName('Set tab colors');
        }

        this.context = context;
        this.menu.open(event);
    }

    module.exports = instance;
});
