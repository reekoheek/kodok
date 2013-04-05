define([], function() {
    var View = Backbone.View.extend({
        el: 'body',
        key: '',
        initialize: function(options) {
            this.key = options.key || 'unknown';
        },

        render: function() {
            var that = this;
            setTimeout(function() {
                that.collection.on('reset', function() {

                    console.log(that.collection);
                });
                that.collection.fetch();
            }, 1000);
            var data = {
                V: this
            };
            this.$el.html(this.template(data));
        }
    });
    return View;
});