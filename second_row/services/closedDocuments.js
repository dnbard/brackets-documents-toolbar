define(function(require, exports, module){
    var _ = require('../vendor/lodash'),
        MainViewManager = brackets.getModule('view/MainViewManager');

    function ClosedDocumentsCollection(){
        this.storage = [];

        MainViewManager.on('workingSetAdd', _.bind(function(event, file, index, panel){
            _.remove(this.storage, function(stored){
                return stored.path === file._path;
            });
        }, this));

        MainViewManager.on('workingSetRemove', _.bind(function(event, file){
            this.add({
                path: file._path,
                name: file._name
            });
        }, this));
    }

    ClosedDocumentsCollection.prototype.add = function(document){
        _.remove(this.storage, function(stored){
            return stored.path === document.path;
        });

        this.storage.push(document);
    }

    ClosedDocumentsCollection.prototype.get = function(){
        if (this.storage.length === 0){
            return null;
        }
        return this.storage.pop();
    }

    ClosedDocumentsCollection.prototype.getName = function(){
        if (this.storage.length === 0){
            return '';
        }
        return _.last(this.storage).name;
    }

    ClosedDocumentsCollection.prototype.getAll = function(){
        return this.storage;
    }

    ClosedDocumentsCollection.prototype.removeAll = function(){
        this.storage = [];
    }

    ClosedDocumentsCollection.prototype.size = function(){
        return _.size(this.storage);
    }

    return new ClosedDocumentsCollection();
});
