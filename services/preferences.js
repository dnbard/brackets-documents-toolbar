var PreferencesManager = require('preferences/PreferencesManager');

define(function(require, exports){
    var prefs = PreferencesManager.getExtensionPrefs('dnbard.documents-toolbar'),
        _ = require('../vendor/lodash'),
        inits = {
            icons: true,
            tooltip: false,
            close_left: false
        };

    exports.init = function(){
        _.each(inits, function(initValue, initKey){
            if (prefs.get(initKey) === undefined){
                prefs.set(initKey, initValue);
            }
        });
    }

    exports.get = function(id){
        return prefs.get(id);
    }
});
