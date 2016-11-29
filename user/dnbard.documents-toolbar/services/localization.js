define(function (require, exports, module){
    var _ = brackets.getModule('thirdparty/lodash'),
        dictionaries = {
            'en': require('text!../locale/en.json'),
            'en-GB': require('text!../locale/en.json'),
            'en-US': require('text!../locale/en.json')
        }, defaultLocale = 'en-US';

    _.each(dictionaries, function(text, locale){
        if (typeof text === 'object'){
            return;
        }

        try{
            dictionaries[locale] = JSON.parse(text);
        } catch(e){
            dictionaries[locale] = {};
        }
    });

    function getCurrentLocale(){
        return brackets.getLocale();
    }

    return {
        get:function(id, params){
            var locale = getCurrentLocale(),
                dictionary,
                result;

            if (dictionaries[locale] === undefined){
                locale = defaultLocale;
            }

            dictionary = dictionaries[locale];
            result = dictionary[id];

            if (!result){
                result = dictionaries[defaultLocale][id];
                if (!result){
                    throw new Error('No such string in dictionary');
                }
            }

            if (typeof result === 'function'){
                return result(params);
            }

            return result;
        }
    }
});
