var CommandMenus = require('command/Menus'),
    CommandManager = require('command/CommandManager');

define(function(require, exports, module){
    var instance = new ContextMenuService()

    function ContextMenuService(){
        var openOptionsCommand,
            self = this,
            contextMenuId = 'document-context_menu';

        this.menu = CommandMenus.registerContextMenu(contextMenuId);

        openOptionsCommand = CommandManager.register('Open options', 'dte_options', function(){
            console.log('+');
        });

        this.menu.addMenuItem(openOptionsCommand);

    }

    ContextMenuService.prototype.open = function(event){
        this.menu.open(event);
    }

    module.exports = instance;
});
