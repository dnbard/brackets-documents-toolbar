/*jshint -W033 */
define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        MainViewManager = brackets.getModule('view/MainViewManager'),
        defaultBackground = '#333333',
        defaultColor = '#FFFFFF',
        storage = require('../services/storage'),
        storageRulesKey = 'rules',
        GeneralOptions = require('./generalOptions');

    function Rule(data){
        data = data || {};

        this.name = ko.observable(data.name || 'Change name');

        this.project = ko.observable(data.project || null);

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

        this.generalOptions = new GeneralOptions();

        this.rules = ko.observableArray([]);
        this.selectedRule = ko.observable(null);

        this.selectedRule.subscribe(function(value){
            if (value === null){
                return;
            }

            self.currentPage('RULES');
        });

        this.currentPage = ko.observable('GENERAL');

        _.each(storage.getKey(storageRulesKey) || {}, function(rule){
            self.rules.push(new Rule(rule));
        });

        if(this.rules().length > 0){
            this.selectedRule(this.rules()[0]);
        }

        this.onSelectRule = function(rule){
            self.selectedRule(rule);
        }

        this.onClose = function(model, event){
            storage.setKey(storageRulesKey, ko.toJS(self.rules));
            event.preventDefault();
            MainViewManager.trigger('workingSetUpdate');
        }

        this.getCaption = function(rule){
            if (!rule.forThisProjectOnly()){
                return rule.name();
            } else {
                return rule.name() + '[' + rule.project() + ']';
            }
        }

        this.getOrCreateRule = function(name){
            var rule = _.find(this.rules(), function(rule){
                return rule.name() === name;
            });

            if (!rule){
                rule = new Rule({
                    name: name
                });
                this.rules.push(rule);
            }

            this.selectedRule(rule);
            return rule;
        }

        this.setPage = function(model, event){
            var page = $(event.target).attr('data-page');

            if (!page){
                throw new Error('Page cannot be empty');
            }

            this.currentPage(page.toUpperCase());
        }

        this.isCurrentPageSelected = function(model, element){
            var page = $(element).attr('data-page');

            if (!page){
                throw new Error('Page cannot be empty');
            }

            return this.currentPage() === page;
        }
    }

    OptionsViewModel.prototype.addNewRule = function(){
        var rule = new Rule();

        this.rules.push(rule);

        if (this.selectedRule() === null){
            this.selectedRule(rule);
        }
    }

    OptionsViewModel.prototype.removeRule = function(){
        var rule = this.selectedRule();
        if (!rule){
            return;
        }

        this.rules.remove(rule);
        if (this.rules().length > 0){
            this.selectedRule(this.rules()[0]);
        } else {
            this.selectedRule(null);
        }
    }

    module.exports = OptionsViewModel;
});
