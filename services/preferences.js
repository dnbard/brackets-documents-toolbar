var PreferencesManager = require('preferences/PreferencesManager');

define(function(require, exports){
    var prefs = PreferencesManager.getExtensionPrefs('dnbard.documents-toolbar');

    exports.init = function(){
        if (prefs.get('icons') === undefined){
            prefs.set('icons', true);
        }
    }

    exports.get = function(id){
        return prefs.get(id);
    }
});
