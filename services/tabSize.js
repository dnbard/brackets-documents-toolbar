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

        this.lastResize = new Date(1,1,1);
        this.tabResizeWorker = function(supressRatioCheck){
            var docs = $('.document-holder .document-name'),
                documentsNameWidth = 0,
                ratio = ($('.documents-holder').width() - $('.document:first').width() - 20) / $('.document-holder').width(),
                docHolderWidth = $('.document-holder').width(),
                now = new Date();

            supressRatioCheck = !!supressRatioCheck;

            //do not fire this handler for multiple times at startup
            if (now - self.lastResize < 10){
                return;
            }

            self.lastResize = now;

            _.each(docs, function(doc){
                documentsNameWidth += $(doc).width();
            });

            //do not enlarge tabs
            if (ratio >= 1 && !supressRatioCheck){
                return;
            }

            //do not enlarge tabs
            if (ratio > 1){
                ratio = 1;
            }

            _.each(docs, function(doc){
                var $doc = $(doc),
                    width = $doc.width();

                $doc.width(width * (1 - (1 - ratio) / documentsNameWidth * docHolderWidth));
            });
        }

        this.internalSizeHandler = function(){
            var docs = $('.document-holder .document-name');

            //do not resize tabs if mouse is nearby
            if (indicator.check('ext-documents')){
                indicator.setHandler('ext-documents', self.tabResizeWorker);
                return false;
            }

            _.each(docs, function(doc){
                var $doc = $(doc);
                $doc.css('width', 'inherited');
            });

            return true;
        }

        this.sizeHandler = function(suppress){
            if (self.internalSizeHandler()){
                setTimeout(function(){
                    self.tabResizeWorker(suppress);
                }, 1);
            }
        }

        this.sizeHandlerSync = function(){
            if (self.internalSizeHandler()){
                self.tabResizeWorker();
            }
        }

        $MainViewManager.on('workingSetAdd', this.sizeHandler);
        $MainViewManager.on('workingSetRemove', this.sizeHandler);
        $MainViewManager.on('workingSetAddList', this.sizeHandler);
        $MainViewManager.on('workingSetRemoveList', this.sizeHandler);
        $DocumentManager.on('pathDeleted', this.sizeHandler);
        $DocumentManager.on('workingSetSort', this.sizeHandler);
        $MainViewManager.on('paneCreate', this.sizeHandler);
        $WorkspaceManager.on('workspaceUpdateLayout', this.sizeHandler);
        /*$WorkspaceManager.on('workspaceUpdateLayout', function(){
            console.log('+');
        });*/

        $(window).on('resize', self.sizeHandler);

        AppInit.appReady(function(){
            self.sizeHandler();
        });
    }

    module.exports = instance;
});
