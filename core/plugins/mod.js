define(['text', 'async'], function(text, async) {
    var MODULE_CONFIG = Kodok.Config.get('module'),
        VIEW_MAP = _.defaults(MODULE_CONFIG.views || {}, { '*': 'core/views/base' });

    var defaultViews = {},
        defaultTemplates = {},
        // defaultCollection,
        defaultModel,
        // collections = {},
        models = {},
        modules = {};

    return {
        load: function (name, req, onload, config) {
            var segments = name.split('/');

            if (modules[name]) {
                onload(modules[name]);
            }

            async.parallel({
                defaultView: function(callback) {
                    if (defaultViews[segments[1]]) {
                        return callback(null, defaultViews[segments[1]]);
                    }

                    var v = VIEW_MAP[segments[1]] || VIEW_MAP['*'];
                    req([v], function (value) {
                        defaultViews[segments[1]] = value;
                        callback(null, value);
                    }, function(err) {
                        // console.error('View: [' + v + '] not found');
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
                // defaultCollection: function(callback) {
                //     if (defaultCollection) {
                //         return callback(null, defaultCollection);
                //     }
                //     req(['core/collection'], function (value) {
                //         defaultCollection = value;
                //         callback(null, value);
                //     }, function(err) {
                //         callback(null);
                //     });
                // },
                defaultModel: function(callback) {
                    if (defaultModel) {
                        return callback(null, defaultModel);
                    }
                    req(['core/model'], function (value) {
                        defaultModel = value;
                        callback(null, value);
                    }, function(err) {
                        callback(null);
                    });
                },
                view: function(callback) {
                    req(['app/modules/' + segments[0] + '/views/' + segments[1]], function (value) {
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
                },
                // collection: function(callback) {
                //     if (collections[segments[0]]) {
                //         return callback(null, collections[segments[0]]);
                //     }
                //     req(['app/modules/' + segments[0] + '/' + segments[0] + '_collection'], function (value) {
                //         collections[segments[0]] = value;
                //         callback(null, value);
                //     }, function(err) {
                //         collections[segments[0]] = null;
                //         callback(null);
                //     });
                // },
                model: function(callback) {
                    if (models[segments[0]]) {
                        return callback(null, models[segments[0]]);
                    }
                    req(['app/modules/' + segments[0] + '/' + segments[0] + '_model'], function (value) {
                        models[segments[0]] = value;
                        callback(null, value);
                    }, function(err) {
                        models[segments[0]] = null;
                        callback(null);
                    });
                }
            }, function(err, results) {
                try {
                    var V = results.view || results.defaultView.extend({});
                    V.prototype.template = results.template || results.defaultTemplate;

                    V.Model = results.model || results.defaultModel.extend({}, {
                        key: segments[0]
                    });

                    V.Model.initialize(function(err) {
                        if (err) {
                            console.error('Error on module creation [' + err.message + ']', err);
                            return onload();
                        }

                        var options = {
                            key: segments[0] + '/' + segments[1],
                            segments: segments
                        };
                        _.defaults(options, MODULE_CONFIG);
                        modules[name] = V;
                        modules[name].instance = new V(options);
                        onload(modules[name]);
                    });

                    // V.Collection = results.collection || results.defaultCollection.extend({
                    //     key: segments[0],
                    //     model: V.Model
                    // });


                    // console.log(modules[name].instance, new modules[name].instance.constructor.Collection());
                } catch(err) {
                    console.error('Error on module creation [' + err.message + ']', err);
                    return onload();
                }
            });
        }
    };
});