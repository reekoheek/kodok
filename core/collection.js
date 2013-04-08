define([], function() {
    var Collection = Backbone.Collection.extend({
        url: function() {
            return Kodok.Config.items.backend.base_url + this.key + '/entries.json';
        }
    });
    return Collection;
});