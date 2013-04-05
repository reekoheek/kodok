require(['kodok'],function(App) {
    var app = new App();

    app.modules([ 'home', 'user' ]);

    // app.route('a', function() {
    // });

    // app.route('', function() {
    // });

    // app.route(/[0-9]+/, function() {
    // });

    app.start();

});