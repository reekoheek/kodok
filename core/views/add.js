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

        initialize: function(options) {
            Base.prototype.initialize.apply(this, arguments);
            this.model = new this.constructor.Model();
        },

        render: function(data) {
            data = _.defaults(data || {}, {
                data: this.model,
                columns: this.constructor.Model.columns
            });

            Base.prototype.render.call(this, data);
        }
    });
    return View;
});