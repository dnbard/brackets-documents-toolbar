define(function(require, exports){
    var storage,
        _ = require('../vendor/lodash'),
        storageKey = "ext_documents-toolbar";

    function init(){
        storage = JSON.parse(localStorage.getItem(storageKey) || '{}');
    }

    function set(st){
        storage = st;
        save();
    }

    function get(){
        return storage;
    }

    function getKey(id){
        return storage[id];
    }

    function setKey(id, value){
        storage[id] = value;
        save();
    }

    function save(){
        localStorage.setItem(storageKey, JSON.stringify(storage));
    }

    exports.set = set;
    exports.get = get;
    exports.init = init;
    exports.getKey = getKey;
    exports.setKey = setKey;
});
