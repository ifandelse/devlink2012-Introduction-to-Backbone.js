/*
	aspect.js - (POC/alpha)
	Jim Cowart 2012
	dual licensed MIT/GPL
 */
define( [
  'underscore'
], function ( _ ) {
  var ViewManager = function() {
    this.views = {}; // holds the views that are registered with the manager
    this.UI = {};    // holds the UI configurations that are defined
    this.priorContext = undefined; // holds the name of the last UI configuration
  };

  //----------------------------------------------------------------------------
  // registerView - registers a view with the manager, under the name provided.
  // The handle to the constructor function (second arg) is used to create an
  // instance of the view the first time getInstance is called.  The rendered
  // and visible booleans are used by the ViewManager to track state of the view.
  // The getInstance call can take an options object.  If options.forceNew = true,
  // then the ViewManager will create a new instance of the view.  If options.args
  // exists, it will be passed into the constructor function of the view.
  //----------------------------------------------------------------------------
  ViewManager.prototype.registerView = function(name, viewCtor, forceNewAlways) {
    this.views[name] = (function() {
      var _instance;
      return {
        rendered: false,
        visible: false,
        getInstance: function(options) {
          var _options = options || {};
          if (!_instance || _options.forceNew || forceNewAlways) {
            this.visible = this.rendered = false;
            _instance = new viewCtor(_options.ctorArgs || {});
          }
          return _instance;
        },
        dispose: function() {
          if (_instance) {
            if (typeof _instance.dispose === 'function') {
              _instance.dispose();
            }
            _instance = undefined;
          }
        }
      }
    })()
  };

  ViewManager.prototype.registerViews = function(views) {
    _.each(views, function(view) {
      this.registerView(view.name, view.ctor);
    }, this);
  };

  //----------------------------------------------------------------------------
  // defineUI - defines a UI configuration, which is effectively a named group
  // of views that need to be stood up, in order.  The first argument is the UI
  // name, second arg is the array of view names (in the order they need to be
  // instantiated/rendered/shown)
  //----------------------------------------------------------------------------
  ViewManager.prototype.defineUI = function(name, dependencies, options) {
    var deps = _.map(dependencies, function(dep){
      if(dep.name) {
        return dep;
      }
      else {
        return { name: dep, options: {}}
      }
    });
    var opts = _.extend({ events: {} }, options);
    var self = this;
    self.UI[name] = {
      options: opts,
      dependencies: deps,
      activate: function(context) {
        if(this.options.events.preActivate) {
          this.options.events.preActivate.call(this);
        }
        var _options = _.extend({}, this.options, context || {});
        _options.priorContext = self.priorContext;
        _options.targetContext = name;

        if (!_options.noHide) {
          // hide anything visible that's not in the dependencies for this UI configuration
          var shouldHide = _.reduce(self.views, function(memo, val, key) {
            if (val.visible && !_.any(this.dependencies, function(dep){
              return dep.name === key;
            })) {
              memo.push(key);
            }
            return memo;
          }, [], this);

          _.each(shouldHide, function(viewName) {
            var instance = self.views[viewName].getInstance();
            if (_options.disposePrevious) {
              self.views[viewName].dispose();
            } else {
              if (typeof instance.hide === 'function') {
                instance.hide();
              }
            }
            self.views[viewName].visible = false;
          });
        }

        // set up, render & show the dependencies for this UI configuration
        _.each(this.dependencies, function(dep) {
          var viewOptions = _.extend({}, dep.options, _options);
          var instance = self.views[dep.name].getInstance(viewOptions);
          if (!self.views[dep.name].rendered) {
            instance.render(viewOptions);
            self.views[dep.name].rendered = true;
          }
          if (!self.views[dep.name].visible) {
            if (instance.show) {
              instance.show(viewOptions);
            }
            self.views[dep.name].visible = true;
          }

          if (instance.update) {
            instance.update(viewOptions);
          }
        });
        self.priorContext = name;
        if(this.options.events.postActivate) {
          this.options.events.postActivate.call(this);
        }
      }
    };
  };

  ViewManager.prototype.defineUIs = function(uis) {
    _.each(uis, function(ui) {
      this.defineUI(ui.name, ui.dependencies, ui.options);
    }, this);
  };

  ViewManager.prototype.addViewToUI = function(uiName, viewName, viewCtor) {
    var uis = _.isArray(uiName) ? uiName : [uiName];

    if (!this.views[viewName]) {
      this.registerView(viewName, viewCtor);
    }

    _.each(uis, function(ui) {
      if (this.UI[ui]) {
        this.UI[ui].dependencies.push(viewName);
      }
    }, this);
  };

  return ViewManager;
} );