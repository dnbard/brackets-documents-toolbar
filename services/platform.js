define(function(require, exports, module){
    var currentPlatform = brackets.platform.toLowerCase(),
        linux = 'linux', //TODO: check linux token here
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils');

    exports.init = function(){
        //https://github.com/dnbard/brackets-documents-toolbar/issues/2
        if (currentPlatform === linux){
            ExtensionUtils.loadStyleSheet(module, '../styles/linux.css');
        }
    }
});
