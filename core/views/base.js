define([], function() {
    var View = Backbone.View.extend({
        el: 'body',
        key: '',
        segments: [],
        initialize: function(options) {
            this.key = options.key || 'unknown';
            this.segments = options.segments || [];
        },

        render: function(data) {
            data = _.defaults(data || {}, {
                V: this
            });
            this.$el.html(this.template(data));
        }
    });
    return View;
});