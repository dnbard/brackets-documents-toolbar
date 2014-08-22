var DocumentManager = require('document/DocumentManager');

define(function(require, exports, module){
    var _ = require('../vendor/lodash'),
        $DocumentManager = $(DocumentManager),
        instance = new TabSizeService();

    function TabSizeService(){
        var self = this;

        this.tabResizeWorker = function(){
            var docs = $('.document-holder .document-name'),
                documentsNameWidth = 0,
                ratio = ($('.documents-holder').width() - $('.document').first().width() - 40) / $('.document-holder').width(),
                docHolderWidth = $('.document-holder').width();

            _.each(docs, function(doc){
                documentsNameWidth += $(doc).width();
            });

            _.each(docs, function(doc){
                var $doc = $(doc),
                    width = $doc.width();

                $doc.width(width * (1 - (1 - ratio) / documentsNameWidth * docHolderWidth));
            });
        }

        this.sizeHandler = function(){
            var docs = $('.document-holder .document-name');
            _.each(docs, function(doc){
                var $doc = $(doc);
                $doc.css('width', 'inherited');
            });

            setTimeout(self.tabResizeWorker, 1);
        }

        this.sizeHandlerSync = function(){
            var docs = $('.document-holder .document-name');
            _.each(docs, function(doc){
                var $doc = $(doc);
                $doc.css('width', 'inherited');
            });

            self.tabResizeWorker();
        }

        $DocumentManager.on('workingSetAdd', this.sizeHandler);
        $DocumentManager.on('workingSetRemove', this.sizeHandler);
        $DocumentManager.on('workingSetAddList', this.sizeHandler);
        $DocumentManager.on('workingSetRemoveList', this.sizeHandler);
        $DocumentManager.on('pathDeleted', this.sizeHandler);
        $DocumentManager.on('workingSetSort', this.sizeHandler);

        $(window).on('resize', this.sizeHandlerSync);
    }

    module.exports = instance;
});
