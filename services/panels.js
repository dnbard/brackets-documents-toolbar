define(function(require, exports, module){
    var _ = require('../vendor/lodash');

    function PanelContentProvider(){
        this.storage = {};
    }

    PanelContentProvider.prototype.register = function(toolbarViewModel, panel){
        this.storage[panel] = {
            viewmodel: toolbarViewModel,
            panel: panel
        };
    }

    PanelContentProvider.prototype.remove = function(panel){
        var result = this.storage[panel];

        if (typeof result !== 'object'){
            throw new Error('Can\'t find toolbar viewmodel for ' + panel);
        }

        delete this.storage[panel];
        return result;
    }

    PanelContentProvider.prototype.isContain = function(file){
        var result = null;
        _.each(this.storage, function(storage, panel){
            var VM = storage.viewmodel,
                foundFile = _.find(VM.documents(), function(document){
                return document._path === file._path;
            });

            if (foundFile){
                result = panel;
                return false;
            }
        });

        return result;
    }

    PanelContentProvider.prototype.selectOtherPanel = function(excludePanel){
        if (typeof excludePanel !== 'string'){
            throw new Error('Invalid argument');
        }

        var vm = _.find(this.storage, function(storage){
            return storage.panel !== excludePanel;
        });

        return vm ? vm.panel : null;
    }

    module.exports = new PanelContentProvider();
});
