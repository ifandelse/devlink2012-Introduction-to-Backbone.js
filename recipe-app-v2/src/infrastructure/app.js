/*
	This is a fairly small top-level application object.  I use this kind of approach to bring together
	higher level application concerns under one 'namespace'.  It's not uncommon to either pass the app
	into other components, or allow those components to access the app object from the global namespace
	if the guarantee can be made that it will exist there before that component accesses it, etc.  The
	Backbone router will not start (nor try to evaluate the root under which the page loads) until the
	init method below is invoked.
 */
define([
	'backbone',
	'bus',
	'infrastructure/ui/router',
    'aspect',
    'infrastructure/ui/viewAssets',
    'libs/postal/postal.diagnostics'
], function(Backbone, bus, Router, ViewManager, viewAssets, DiagnosticsWireTap) {

	var _appLogging = true;
	var app = {
		viewManager : new ViewManager(),
		router      : undefined,
		models      : {},
		views       : {},
		init        : function() {
			this.router = new Router( { app: this });
			Backbone.history.start( {
				pushState : true
			} );
		},
		bus : {
			ui : new DiagnosticsWireTap("ui-channel", function (x) {
				console.log(x);
			}, [ { channel : "ui" }  ]),
			data : new DiagnosticsWireTap("data-channel", function (x) {
				console.log(x);
			}, [ { channel : "data" } ]),
			comm : new DiagnosticsWireTap("comm-channel", function (x) {
				console.log(x);
			}, [ { channel : "comm" } ])
		},
		appLog : function (opt) {
			if (!opt) {
				return _appLogging;
			} else {
				_appLogging = opt;
			}
		}
	};

	_.bind(app.init, app);

	// wire the view manager to the message bus
	bus.ui.subscribe("ui.show",function (data, env) {
		this.UI[ data.name ].activate(data.options);
	}).withContext(app.viewManager);

	viewAssets.load( app.viewManager );

	return app;
});