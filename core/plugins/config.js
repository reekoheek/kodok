define(['json', 'async', 'underscore'], function(json, async, underscore) {
    var options = Kodok.options(), C;
    return {
        load: function (name, req, onload, config) {
            if (C) return onload(C);

            async.parallel({
                'defaultConfig': function(callback) {
                    json.get(req.toUrl('app/config/' + name + '.json'), function(data) {
                        callback(null, data);
                    });
                },
                'envConfig': function(callback) {
                    json.get(req.toUrl('app/config/' + options.environment + '/' + name + '.json'), function(data) {
                        callback(null, data);
                    });
                }
            }, function(err, results) {
                return onload(C = _.defaults(results.envConfig, results.defaultConfig));
            });

        }
    }
});