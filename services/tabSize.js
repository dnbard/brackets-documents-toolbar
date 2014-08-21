var DocumentManager = require('document/DocumentManager');

define(function(require, exports, module){
    var _ = require('../vendor/lodash'),
        $DocumentManager = $(DocumentManager),
        instance = new TabSizeService();

    function TabSizeService(){
        var self = this;

        this.tabResizeWorker = function(){
            var docs = $('.document-holder .document-name'),
                ratio = ($('div.documents-holder').width() - $('.document').first().width() - 20) / $('span.document-holder').width(),
                previousRatio = 1;

            while(ratio < 0.99 && Math.abs(ratio - previousRatio) > 0.005){
                console.log(ratio);

                _.each(docs, function(doc){
                    var $doc = $(doc),
                        width = $doc.width();

                    $doc.width(width * ratio - 5);
                });

                previousRatio = ratio;
                ratio = ($('div.documents-holder').width() - $('.document').first().width() - 20) / $('span.document-holder').width();
            }
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
