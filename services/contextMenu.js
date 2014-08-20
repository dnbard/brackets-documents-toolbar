var CommandMenus = require('command/Menus'),
    CommandManager = require('command/CommandManager');

define(function(require, exports, module){
    var instance = new ContextMenuService();

    function ContextMenuService(){
        var openOptionsCommand,
            addNewRuleCommand,
            self = this,
            contextMenuId = 'document-context_menu';

        this.context = null;

        this.menu = CommandMenus.registerContextMenu(contextMenuId);

        openOptionsCommand = CommandManager.register('Open options', 'dte_options', function(){
            console.log('+');
        });

        addNewRuleCommand = CommandManager.register('Change tab color', 'dte_addRule', function(){
            console.log('+');
        });

        this.menu.addMenuItem(addNewRuleCommand);
        this.menu.addMenuItem(openOptionsCommand);

    }

    ContextMenuService.prototype.open = function(context, event){
        this.context = context;
        this.menu.open(event);
    }

    module.exports = instance;
});
