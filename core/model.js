define([], function() {
    var Instance = {
        urlRoot: function() {
            return Kodok.Config.items.backend.base_url + this.constructor.key;
        }
    };

    var Class = {
        _initialized: false,

        columns: [],

        initialize: function(callback) {
            var M = this;

            var c = this.entries();
            c.once('sync', function() {
                M._initialized = true;
                if (c.length > 0) {
                    M.columns = _.keys(c.models[0].attributes);
                }
                callback(null);
            });
            c.fetch().fail(function() {
                M._initialized = true;
                c.off('sync');
                callback(null);
            });
        },

        entries: function() {
            var M = this;

            var C = Backbone.Collection.extend({
                model: M,
                parse: function(data) {
                    if (!data) return data;
                    return data.entries;
                },
                url: function() {
                    return Kodok.Config.items.backend.base_url + M.key;
                }
            });
            return new C();
        }
    };

    var Model = Backbone.Model.extend(Instance, Class);
    return Model;
});