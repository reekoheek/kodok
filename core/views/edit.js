define(['core/views/base'], function(Base) {
    var View = Base.extend({
        model: null,

        events: {
            'submit form': 'onSave'
        },

        onSave: function(evt) {
            evt.preventDefault();
            var model = this.model;
            _.each($(evt.target).serializeArray(), function(f) {
                model.set(f.name, f.value);
            });
            model.save();
        },

        render: function(data) {
            var that = this;
            if (!data.segments[2]) return;
            this.model = new this.constructor.Model({
                id: data.segments[2]
            });

            this.model.once('sync', function() {
                data = _.defaults(data || {}, {
                    data: that.model,
                    columns: that.constructor.Model.columns
                });

                Base.prototype.render.call(that, data);

            });
            this.model.fetch();

        }
    });
    return View;
});