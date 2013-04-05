var Kodok = window.Kodok = function() {
    var app = this;

    this.router = new Kodok.Router();
};

Kodok.prototype.route = function(uri, route) {
    this.router.route.apply(this.router, arguments);
};

Kodok.prototype.modules = function(modules) {
    this.router.modules(modules);
}

Kodok.prototype.start = function() {
    this.router.start();
};

Kodok.version = '0.0.1';

Kodok.loadScript = function(uri, cb) {
    var script = document.createElement('script');
    script.addEventListener('load', function() {
        if (cb) return cb();
    });
    script.src = uri;
    document.getElementsByTagName('head')[0].appendChild(script);
}

Kodok.defaultOptions = {
    'app': 'app',
    'core': 'core',
    'vendor': 'vendor',
    'environment': 'production'
};

Kodok._options = null;
Kodok.options = function() {
    if (!Kodok._options) {

        var script = document.getElementsByTagName('script');

        for(var i = 0; i < script.length; i++) {
            if (script[i].dataset.app || script[i].dataset.core || script[i].dataset.vendor || script[i].dataset.environment) {
                Kodok._options = JSON.parse(JSON.stringify(script[i].dataset));
                break;
            }
        }

        Kodok._options = Kodok._options || {};
        for(var i in Kodok.defaultOptions) {
            Kodok._options[i] = Kodok._options[i] || Kodok.defaultOptions[i];
        }
    }
    return Kodok._options;
}

if (typeof define == 'undefined') {
    Kodok.loadScript(Kodok.options().vendor + '/require/require.js', function() {
        require.config({
            paths: {
                'text': Kodok.options().vendor + '/require/plugins/text',
                'json': Kodok.options().core + '/plugins/json',
                'mod': Kodok.options().core + '/plugins/mod'
            }
        });

        require(['json!build.json'], function(build) {
            build.urlArgs = "t=" +  (new Date()).getTime();
            require.config(build);

            require(['kodok'], function() {
                require([Kodok.options().app + '/main']);
            });
        });
    });
} else {
    define('kodok', ['core/router', 'core/config', 'backbone'], function(Router, Config) {
        Kodok.Router = Router;
        Kodok.Config = Config;
        return  Kodok;
    });
}