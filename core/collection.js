define([], function() {
    var Collection = Backbone.Collection.extend({
        key: '',
        url: function() {
            return Kodok.Config.items.backend.base_url + this.key + '/entries.json';
        },
        initialize: function(options) {
            this.key = options.key || 'unknown-collection';
        }
    });
    return Collection;
});