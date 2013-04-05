define(['text', 'async'], function(text, async) {
    var defaultView, defaultCollection, defaultTemplates = {}, modules = {};

    return {
        load: function (name, req, onload, config) {
            var segments = name.split('/');

            if (modules[name]) {
                onload(modules[name]);
            }

            async.parallel({
                defaultView: function(callback) {
                    if (defaultView) {
                        return callback(null, defaultView);
                    }

                    req(['core/view/crud'], function (value) {
                        defaultView = value;
                        callback(null, value);
                    }, function(err) {
                        callback(null);
                    });
                },
                defaultCollection: function(callback) {
                    if (defaultView) {
                        return callback(null, defaultView);
                    }

                    req(['core/collection'], function (value) {
                        defaultCollection = value;
                        callback(null, value);
                    }, function(err) {
                        callback(null);
                    });
                },
                defaultTemplate: function(callback) {
                    if (defaultTemplates[segments[1]]) {
                        return callback(null, defaultTemplates[segments[1]]);
                    }
                    var templateUrl = req.toUrl('core/templates/' + segments[1] +'.html');
                    text.get(templateUrl, function(data) {
                        var t = _.template(data);
                        defaultTemplates[segments[1]] = t;
                        callback(null, t);
                    }, function() {
                        callback(null);
                    });
                },
                view: function(callback) {
                    req(['app/modules/' + name], function (value) {
                        callback(null, value);
                    }, function(err) {
                        callback(null);
                    });
                },
                collection: function(callback) {
                    req(['app/modules/' + name + '_collection'], function (value) {
                        callback(null, value);
                    }, function(err) {
                        callback(null);
                    });
                },
                template: function(callback) {
                    var templateUrl = req.toUrl('app/modules/' + segments[0] + '/templates/' + segments[1] +'.html');
                    text.get(templateUrl, function(data) {
                        callback(null, _.template(data));
                    }, function() {
                        callback(null);
                    });
                }
            }, function(err, results) {
                // console.log(results);
                var V = results.view || results.defaultView.extend({});
                V.prototype.template = results.template || results.defaultTemplate;

                V.Collection = results.collection || results.defaultCollection;

                modules[name] = V;
                modules[name].instance = new V({
                    key: name,
                    collection: new V.Collection({
                        key: segments[0]
                    })
                });

                onload(modules[name]);
            });
        }
    };
});