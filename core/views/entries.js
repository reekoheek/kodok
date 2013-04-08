define(['core/views/base'], function(Base) {
    var View = Base.extend({
        collection: null,

        initialize: function(options) {
            Base.prototype.initialize.apply(this, arguments);
            this.collection = this.constructor.Model.entries();
        },

        render: function(data) {
            var that = this;
            that.collection.once('sync', function() {
                data = _.defaults(data || {}, {
                    data: that.collection,
                    columns: that.collection.model.columns
                });

                Base.prototype.render.call(that, data);
            });
            that.collection.fetch().fail(function() {
                that.collection.off('sync');
            });
        }
    });
    return View;
});