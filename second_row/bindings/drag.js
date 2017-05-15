var DocumentManager = require('document/DocumentManager'),
    MainViewManager = require('view/MainViewManager'),
    CommandManager = require('command/CommandManager');

define(function(require, exports){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        FileTransfer = require('../services/fileTransfer'),
        dragWho = null,
        dragWhere = null;

    ko.bindingHandlers.drag = {
        init: function(element, valueAccessor) {
            var value = valueAccessor(),
                $el = $(element);

            $el.attr('draggable','true');

            $el.on('dragstart', function(event){
                var $target = $(event.target),
                    $dragPanels = $('.ext-documents');

                $target.addClass('dragged');
                dragWho = $target;

                $dragPanels.on('dragenter', function(event){
                    dragWhere = 'panel';
                });

                $dragPanels.on('dragover', function(event){
                    event.originalEvent.dataTransfer.dropEffect = 'move';

                    return false;
                });
            });

            $el.on('dragend', function(event){
                var $target = $(event.target),
                    $dragPanels = $('.ext-documents');

                $target.removeClass('dragged');

                if (dragWho && dragWhere){
                    var fromPath = dragWho.attr('title'),
                        toPath = dragWhere !== 'panel' ? dragWhere.attr('title') : null,
                        from = MainViewManager.findInAllWorkingSets(fromPath)[0],
                        where = toPath ? MainViewManager.findInAllWorkingSets(toPath)[0] : null,
                        fromPanel = from.paneId,
                        toPanel = where ? where.paneId : fromPanel === 'first-pane' ? 'second-pane' : 'first-pane',
                        fromIndex = from.index,
                        toIndex = where ? where.index : $('#' + toPanel + ' .ext-documents .document-holder > .document').length,
                        diff = toIndex - fromIndex,
                        direction = diff / Math.abs(diff);

                    if (where === null && MainViewManager.getPaneIdList().length === 1 && toIndex === 0){
                        //don't let the send tab to second panel if it isn't active
                        //https://github.com/dnbard/brackets-documents-toolbar/issues/53
                        return;
                    }

                    if (fromPanel === toPanel){
                        if (Math.abs(diff) <= 1){
                            //No drag-n-drop until Brackets API is freezed
                            //MainViewManager._getPaneIdForPath
                            MainViewManager._swapWorkingSetListIndexes(toPanel, fromIndex, toIndex);
                        } else {
                            while(fromIndex !== toIndex){
                                MainViewManager._swapWorkingSetListIndexes(toPanel, fromIndex, toIndex);
                                toIndex -= direction;
                            }
                        }

                        dragWho = null;
                        dragWhere = null;
                    } else {
                        DocumentManager.getDocumentForPath(fromPath).always(function(document){
                            var file = document.file,
                                fileTransfer = new FileTransfer();

                                fileTransfer.toAnotherPanel({
                                    fromPanel: fromPanel,
                                    toPanel: toPanel,
                                    file: file,
                                    fromIndex: fromIndex,
                                    callback: function(){
                                        dragWho = null;
                                        dragWhere = null;
                                    }
                                });
                            });
                    }

                    $dragPanels.off('dragover');
                    $dragPanels.off('dragenter');
                }
            });

            $el.on('dragenter', function(event){
                var $target = $(event.currentTarget),
                    $allDocuments = $('.ext-documents .document-holder > .document');

                if ($target[0] == dragWho[0]){
                    return;
                }

                if (_.indexOf($allDocuments, dragWho[0]) > _.indexOf($allDocuments, $target[0])){
                    $target.addClass('drag-target_left');
                } else {
                    $target.addClass('drag-target_right');
                }

                dragWhere = $target;

                return false;
            });

            $el.on('dragleave', function(event){
                var $target = $(event.currentTarget),
                    document = window.document,
                    rect = this.getBoundingClientRect();

                if ($target[0] == dragWho[0]){
                    return;
                }

                var getXY = function getCursorPosition(event) {
                    var x, y;

                    if (typeof event.clientX === 'undefined') {
                        x = event.pageX + document.documentElement.scrollLeft;
                        y = event.pageY + document.documentElement.scrollTop;
                    } else {
                        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                    }

                    return { x: x, y : y };
                };

                var e = getXY(event.originalEvent);

                // Check the mouseEvent coordinates are outside of the rectangle
                if (e.x > rect.left + rect.width - 1 || e.x < rect.left || e.y > rect.top + rect.height - 1 || e.y < rect.top) {
                    $target.removeClass('drag-target_left');
                    $target.removeClass('drag-target_right');
                    setTimeout(function(){
                        dragWhere = null;
                    }, 1);
                }

                return false;
            });

            $el.on('dragover', function(event){
                event.originalEvent.dataTransfer.dropEffect = 'move';

                return false;
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
                var $element = $(element);

                $element.off('dragstart');
                $element.off('dragend');
                $element.off('dragenter');
                $element.off('dragleave');
                $element.off('dragover');
            });
        }
    };
});
