define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        prefs = require('../services/preferences'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils');

    function showWorkingFiles(value){
        if (value){
            $('link[href*="/styles/hideWorkingFiles.css"]').remove();
        } else {
            ExtensionUtils.loadStyleSheet(module, '../styles/hideWorkingFiles.css');
        }
    }

    function GeneralOptions(){
        this.showWorkingFiles = ko.observable();
        this.showWorkingFiles.subscribe(function(value){
            showWorkingFiles(value);
            prefs.set('workingFiles', value);
        });

        this.showIcons = ko.observable();
        this.showIcons.subscribe(function(value){
            prefs.set('icons', value);
        });

        this.showWorkingFiles(prefs.get('workingFiles'));
        this.showIcons(prefs.get('icons'));
    }

    module.exports = GeneralOptions;
});
