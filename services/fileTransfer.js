var MainViewManager = require('view/MainViewManager'),
    CommandManager = require('command/CommandManager');

define(function(require, exports, module){
    function FileTransferHelper(){
    }

    FileTransferHelper.prototype.toAnotherPanel = function(data){
        MainViewManager._moveView(data.fromPanel, data.toPanel, data.file).always(function(){
            CommandManager.execute('file.open', {
                fullPath: data.file.fullPath,
                paneId: data.toPanel
            }).always(function(){
                var panelSelector = data.fromPanel === 'first-pane' ? '#working-set-list-first-pane' : '#working-set-list-second-pane',
                    anotherPanelSelector = data.fromPanel !== 'first-pane' ? '#working-set-list-first-pane' : '#working-set-list-second-pane',
                    filesSelector = '.open-files-container ul > li',
                    filesHolderSelector = '.open-files-container ul',
                    panel = $(panelSelector),
                    files = panel.find(filesSelector),
                    file = files[data.fromIndex],
                    anotherPanelHolder = $(anotherPanelSelector).find(filesHolderSelector);

                file.remove();
                anotherPanelHolder.prepend(file);

                MainViewManager.trigger('workingSetSort', data.toPanel === 'first-pane' ? 'second-pane' : 'first-pane');

                MainViewManager.focusActivePane();

                if (typeof data.callback === 'function'){
                    data.callback();
                }
            });
        });
    }

    module.exports = FileTransferHelper;
});
