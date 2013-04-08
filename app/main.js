require(['kodok'],function(App) {
    var app = new App();

    // Backbone.emulateHTTP = true;
    // Backbone.emulateJSON = true;

    app.modules([ 'home', 'user' ]);

    // app.route('a', function() {
    // });

    // app.route('', function() {
    // });

    // app.route(/[0-9]+/, function() {
    // });

    app.start();

});