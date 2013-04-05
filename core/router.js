define(['backbone'], function() {
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
            // console.log(arguments.callee.caller);
            // FIXME move this to Kodok.Event method
            $('body').html('<h1>404</h1>');
        },

        _default: function(actions) {
            var router = this;
            var view = '/404';

            actions = actions || '/';

            if (actions[0] == '!') {
                actions = actions.substr(1);
            }

            if (actions[0] == '/') {
                var segments = actions.split('/');
                segments[1] = segments[1] || "home";
                segments[2] = segments[2] || "index";
                segments = segments.slice(1);

                if (!router.modules[segments[0]]) return router._404();

                require(['mod!' + segments.join('/')], function(Module) {
                    Module.instance.render();
                }, function() {
                    return router._404();
                });
            } else {
                return router._404();
            }
        },

        start: function() {
            Backbone.history.start();
        },

        modules: function(modules) {
            for(var i in modules) {
                this.modules[modules[i]] = modules[i];
            }
        }
    });
    return Router;
})