define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        prefs = require('../services/preferences'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        fonts = require('../services/fonts');

    function showWorkingFiles(value){
        if (value){
            $('link[href*="/styles/hideWorkingFiles.css"]').remove();
        } else {
            ExtensionUtils.loadStyleSheet(module, '../styles/hideWorkingFiles.css');
        }
    }

    function grayscaleIcons(value){
        if (value){
            ExtensionUtils.loadStyleSheet(module, '../styles/grayscaleIcons.css');
        } else {
            $('link[href*="/styles/grayscaleIcons.css"]').remove();
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

        this.useBracketsFont = ko.observable();
        this.useBracketsFont.subscribe(function(value){
            fonts.change(value);
            prefs.set('brackets_font', value);
        });

        this.grayscaleIcons = ko.observable();
        this.grayscaleIcons.subscribe(function(value){
            grayscaleIcons(value);
            prefs.set('grayscaleIcons', value);
        });

        this.showWorkingFiles(prefs.get('workingFiles'));
        this.showIcons(prefs.get('icons'));
        this.useBracketsFont(prefs.get('brackets_font'));
        this.grayscaleIcons(prefs.get('grayscaleIcons'));
    }

    module.exports = GeneralOptions;
});
