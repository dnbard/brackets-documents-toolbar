var PreferencesManager = require('preferences/PreferencesManager');

define(function(require, exports, module){
    var prefs  = PreferencesManager.getExtensionPrefs("fonts"),
        isChange = false;

    // monitor brackets.json file changes
    prefs.on("change", "fontSize", applyFontChanges);

    // monitor brackets.json file changes
    prefs.on("change", "fontFamily", applyFontChanges);

    function applyFontChanges(){
        if (!isChange){
            return;
        }
        $('.brFont').css('font-size', prefs.get("fontSize"))
            .css('font-family', prefs.get("fontFamily"));
    }

    exports.init = function(){ }

    exports.change = function(value){
        isChange = value;
        if (value){
            applyFontChanges();
        } else {
            $('.brFont').css('font-size', 'inherit')
                .css('font-family', 'inherit');
        }
    }
});
