/*jshint -W033 */
define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        defaultBackground = '#333333',
        defaultColor = '#FFFFFF',
        storage = require('../services/storage'),
        storageRulesKey = 'rules';

    function Rule(data){
        data = data || {};

        this.name = ko.observable(data.name || 'Change name');

        this.project = ko.observable(data.project || null)

        this.forThisProjectOnly = ko.observable(data.forThisProjectOnly || false);
        this.forThisProjectOnly.subscribe(_.bind(function(value){
            if (value){
                this.project(ProjectManager.getProjectRoot()._name);
            } else {
                this.project(null);
            }
        }, this));

        this.background = ko.observable(data.background || defaultBackground);
        this.color = ko.observable(data.color || defaultColor);
    }

    function OptionsViewModel(){
        var self = this;

        this.rules = ko.observableArray([]);

        _.each(storage.getKey(storageRulesKey) || {}, function(rule){
            self.rules.push(new Rule(rule));
        });

        this.selectedRule = ko.observable(null);

        this.onSelectRule = function(rule){
            self.selectedRule(rule);
        }

        this.onClose = function(model, event){
            storage.setKey(storageRulesKey, ko.toJS(self.rules));
            event.preventDefault();
        }
    }

    OptionsViewModel.prototype.addNewRule = function(){
        this.rules.push(new Rule());
    }

    module.exports = OptionsViewModel;
});
