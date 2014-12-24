var DocumentManager = require('document/DocumentManager'),
    MainViewManager = require('view/MainViewManager'),
    WorkspaceManager = require('view/WorkspaceManager'),
    AppInit = require('utils/AppInit');

define(function(require, exports, module){
    var _ = require('../vendor/lodash'),
        $DocumentManager = $(DocumentManager),
        $MainViewManager = $(MainViewManager),
        $WorkspaceManager = $(WorkspaceManager),
        instance = new TabSizeService(),
        indicator = require('../bindings/mouseIndicator');

    function TabSizeService(){
        var self = this;

        this.zoom = 1;

        this.lastResize = new Date(1,1,1);
        this.tabResizeWorker = function(supressRatioCheck){
            //no need for that code, we use flex now;
            return true;
        }

        this.internalSizeHandler = function(){
            var docs = $('.document-holder .document-name');

            _.each(docs, function(doc){
                var $doc = $(doc);
                $doc.css('width', 'inherited');
            });

            return true;
        }

        this.sizeHandler = function(suppress){
            return true;
        }

        this.sizeHandlerSync = function(){
            return true;
        }
    }

    module.exports = instance;
});
