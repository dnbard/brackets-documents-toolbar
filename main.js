define(function (require, exports, module) {
    var ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        GeneralOptions = require('./viewmodels/generalOptions');

    ExtensionUtils.loadStyleSheet(module, 'styles/main.css');
    ExtensionUtils.loadStyleSheet(module, 'styles/awesome.css');
    ExtensionUtils.loadStyleSheet(module, 'styles/pictonic.css');

    require('./services/platform').init();

    require('./bindings/fade');
    require('./bindings/drag');
    require('./bindings/editableText');
    require('./bindings/colorpicker');
    require('./bindings/mouseIndicator');

    require('./services/injector').init();
    require('./services/preferences').init();
    require('./services/storage').init();
    require('./services/tabSize');

    require('./services/onlineTracking').init();

    new GeneralOptions();
});
