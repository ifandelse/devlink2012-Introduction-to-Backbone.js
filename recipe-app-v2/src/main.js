/*
 main.js serves as the "main" entry point for JavaScript in the application.
 My typical approach is to first require any foundational libraries and resources.
 Once those are loaded (which occurs by line 26), then we require the "app" module.
 */
require.config( {
	paths : {
		text       : "libs/text",
		backbone   : 'libs/backbone',
		underscore : 'libs/underscore',
		app        : 'infrastructure/app',
		postal     : "libs/postal/postal",
		mockjax    : 'libs/jquery-mockjax-1.4.0',
		aspect     : 'libs/aspect/aspect',
		bus        : 'infrastructure/comm/bus'
	},
	shim : {
		mockjax : [ 'jquery' ]
	}
} );

// This first require statement is pulling in foundational libraries
require( [ 'backbone', 'jquery', 'underscore', 'infrastructure/comm/resource-mocks', 'libs/deepExtend' ],
	function () {
		// Now that we've included any modules that need to be 'stood up' before the app launches
		// we require the app module, place the app in a global namespace (for convenience) and init
		require( [ 'app' ], function ( app ) {
			window.app = app;
			app.init();
		} );
	} );