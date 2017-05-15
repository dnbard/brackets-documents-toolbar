define(function(require, exports){
    var Dialogs = brackets.getModule('widgets/Dialogs'),
        modalTemplate = require('text!../templates/modal.html'),
        ko = require('../vendor/knockout'),
        ModalViewModel = require('../viewmodels/options');

    function showModal(Viewmodel, template){
        var dlg = Dialogs.showModalDialogUsingTemplate(template)._$dlg,
            viewModelInstance = new Viewmodel(dlg);

        ko.applyBindings(viewModelInstance, dlg[0]);
        return viewModelInstance;
    }

    function showHandler(){
        return showModal(ModalViewModel, modalTemplate);
    }

    exports.showHandler = showHandler;
    exports.showModal = showModal;
});
