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
	'infrastructure/router',
    'views/container'
], function(Backbone, Router) {
	var recipeApp = {
		router: undefined,
		models: {},
		views: {},
		init: function() {
			this.router = new Router( { recipeApp: this });
			Backbone.history.start( {
				pushState : true
			} );
		}
	};

	_.bind(recipeApp.init, recipeApp);

	return recipeApp;
});