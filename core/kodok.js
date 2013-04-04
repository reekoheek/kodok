var Kodok = function() {
    var Router = Backbone.Router.extend({
        routes: {
            '!/404': '_404',
            '*actions': '_default'
        },

        navigate: function(fragment, options) {
            fragment = (fragment == '/') ? '' : '!' + fragment;
            Backbone.Router.prototype.navigate.apply(this, [fragment, options]);
        },

        _404: function() {
            alert('404');
        },

        _default: function(actions) {
            var view = '/404';

            actions = actions || '/';

            if (actions[0] == '!') {
                actions = actions.substr(1);
            }

            if (actions[0] == '/') {
                var segments = actions.split('/');
                segments[1] = segments[1] || "home";
                segments[2] = segments[2] || "index";

                require(['core/plugins/module!' + segments.join('/')], function() {
                    console.log('else', actions);
                });
            } else {
                this.navigate('/404');
            }
        }
    });

    this.router = new Router();
};

Kodok.prototype.route = function(uri, route) {
    this.router.route.apply(this.router, arguments);
};

Kodok.prototype.start = function() {
    // FIXME get configuration from app/config/config.json
    Backbone.history.start();
};

Kodok.version = '0.0.1';
console.log('Kodok version:', Kodok.version);

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
    'vendor': 'vendor'
};

(function() {
    var options = null;
    Kodok.options = function() {
        if (!options) {

            var script = document.getElementsByTagName('script');

            for(var i = 0; i < script.length; i++) {
                if (script[i].dataset.app) {
                    options = JSON.parse(JSON.stringify(script[i].dataset));
                    break;
                }
            }

            options = options || {};
            for(var i in Kodok.defaultOptions) {
                options[i] = options[i] || Kodok.defaultOptions[i];
            }
        }
        return options;
    }
})();

if (typeof define == 'undefined') {
    define = function() {
        var App = arguments[1]();
    };
    define.__emulate__ = true;
}

define(['kodok-deps'], function() {
    var emulate = false, options = Kodok.options();

    if (define.__emulate__) {
        emulate = true;
        delete define;
    }

    // codes below will be invoke if no requirejs
    if (typeof requirejs == 'undefined') {
        console.log('init requirejs');

        Kodok.loadScript(options.vendor + '/require/require.js', function() {
            requirejs.config({
                "paths": {
                    "vendor": "vendor",
                    "core": "core",
                    "app": "app",
                    "kodok": "core/kodok",
                    "module": "core/plugins/module",
                    "backbone": "vendor/backbone/backbone-min",
                    "underscore": "vendor/underscore/underscore-min",
                    "jquery": "vendor/jquery/jquery-1.9.1.min",
                    "async": "vendor/async/async"
                },
                "shim": {
                    "backbone": {
                        "deps": [ "jquery", "underscore", "async", "module" ]
                    }
                },
                "name": "app/main",
                "out": "dist/main-min.js",
                "optimize": "none"
            });

            // FIXME acquire config from build.js
            requirejs.config({
                'urlArgs': "bust=" +  (new Date()).getTime(),
                'paths': {
                    'app': options.app,
                    'vendor': options.vendor,
                    'core': options.core,
                    'kodok': options.core + '/kodok',
                    'kodok-deps': options.core + '/kodok-deps',
                    'module': options.core + '/plugins/module',
                    'backbone': options.vendor + '/backbone/backbone',
                    'underscore': options.vendor + '/underscore/underscore-min',
                    'jquery': options.vendor + '/jquery/jquery-1.9.1.min',
                    'async': options.vendor + '/async/async'
                }
            });

            define('kodok', ["backbone"], function() {
                return  Kodok;
            });

            require(['kodok-deps'], function() {
                require([options.app + '/main']);
            });
        });

    }


    // Kodok.loadScript('test/plain.js', function() {
    //     alert('hahahaha');
    // });

    return Kodok;
});

