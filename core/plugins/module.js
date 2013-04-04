define(['async'], function() {
    return {
        load: function (name, req, onload, config) {
            //req has the same API as require().
            var segments = name.split('/');
            req(['app/modules' + name], function (value) {
                onload(value);
            }, function(err) {

                console.log(segments);
            });
            // console.log(arguments);
            // console.log();
        }
    };
});