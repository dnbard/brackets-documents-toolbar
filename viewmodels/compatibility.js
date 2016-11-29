define(function(require, exports, module){
    var ko = require('../vendor/knockout');

    function CompatibilityViewModel(dlg){
        var self = this;

        this.incompatibleExtensions = ko.observableArray([]);
        this.isChanged = ko.observable(false);
        this.dlg = dlg;

        this.onRemove = function(extension, event, viewmodel){
            var ExtensionManager = brackets.getModule('extensibility/ExtensionManager');

            ExtensionManager.remove(extension.id)
                .done(function(){
                    self.isChanged(true);
                    self.incompatibleExtensions.remove(extension);
                })
                .fail(function(){
                    console.error('Unable to remove %s extension', extension.title);
                });

            event.stopPropagation();
        }
    }

    CompatibilityViewModel.prototype.onClose = function(){
        //enough of this =)
    }

    CompatibilityViewModel.prototype.onRestart = function(){
        var CommandManager = brackets.getModule('command/CommandManager');
        CommandManager.get('debug.refreshWindow').execute();
    }

    CompatibilityViewModel.prototype.setData = function(incompatibleExtensions){
        this.incompatibleExtensions(incompatibleExtensions || []);
    }

    return CompatibilityViewModel;
});
