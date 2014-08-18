/*jshint -W033 */
define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        ProjectManager = brackets.getModule('project/ProjectManager');

    function Rule(){
        this.name = ko.observable('Change name');

        this.project = ko.observable(null)

        this.forThisProjectOnly = ko.observable(false);
        this.forThisProjectOnly.subscribe(_.bind(function(value){
            if (value){
                this.project(ProjectManager.getProjectRoot()._name);
            } else {
                this.project(null);
            }
        }, this));
    }

    function OptionsViewModel(){
        var self = this;

        this.rules = ko.observableArray([]);
        this.selectedRule = ko.observable(null);

        this.onSelectRule = function(rule){
            self.selectedRule(rule);
        }
    }

    OptionsViewModel.prototype.addNewRule = function(){
        this.rules.push(new Rule());
    }

    module.exports = OptionsViewModel;
});
