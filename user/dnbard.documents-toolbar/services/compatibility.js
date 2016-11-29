define(function(require, exports, module){
    var _ = require('../vendor/lodash'),
        incompatibleExtensionsList = [{
            id: 'custom-work-for-brackets'
        },{
            id: 'brackets-minimap',
            title: 'Minimap'
        }],
        ModalService = require('./modal'),
        modalTemplate = require('text!../templates/compatibility.html'),
        modalViewModel = require('../viewmodels/compatibility');

    function check(){
        var ExtensionManager = brackets.getModule('extensibility/ExtensionManager'),
            extensions = _.keys(ExtensionManager.extensions),
            installedIncompatibleExtensions = _.chain(incompatibleExtensionsList)
                .map(function(incompatibleExtension){
                    return _.contains(extensions, incompatibleExtension.id) ? incompatibleExtension : null;
                })
                .compact()
                .value();

        console.log(installedIncompatibleExtensions);

        if (installedIncompatibleExtensions.length > 0){
            var modal = ModalService.showModal(modalViewModel, modalTemplate);
            modal.setData(installedIncompatibleExtensions);
        }
    }

    exports.check = check;
});
