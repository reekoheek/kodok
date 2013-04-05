define(['text'], function(text) {
    return {

        get: function(url, cb) {
            text.get(url, function(data){
                var lines = data.split("\n");
                var newdata = [];
                for(var i in lines) {
                    if (lines[i].trim().substr(0, 2) != '//') {
                        newdata.push(lines[i]);
                    }
                }
                if (cb) return cb(JSON.parse(newdata.join('\n')));
            }, function() {
                if (cb) return cb(null);
            });
        },

        load: function (name, req, onload, config) {
            this.get(req.toUrl(name), function(data) {
                return onload(data);
            });
        }
    };
});