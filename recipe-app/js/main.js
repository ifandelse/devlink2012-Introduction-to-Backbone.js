/*
	main.js serves as the "main" entry point for JavaScript in the application.
	My typical approach is to first require any foundational libraries and resources.
	Once those are loaded (which occurs by line 18), then we require the "app" module.
 */
require.config( {
	paths : {
		text       : "libs/text",
		backbone   : 'libs/backbone',
		underscore : 'libs/underscore',
		recipeApp  : 'infrastructure/app' ,
    mockjax    : 'libs/jquery-mockjax-1.4.0'
	},
  shim: {
    mockjax : [ 'jquery' ]
  },
	baseUrl : 'js'
} );

// This first require statement is pulling in foundational libraries
require( ['backbone', 'jquery', 'underscore', 'infrastructure/resource-mocks'],
	function (  ) {
		// Now that we've included any modules that need to be 'stood up' before the app launches
		// we require the app module, place the app in a global namespace (for convenience) and init
		require( ['recipeApp'], function ( recipeApp ) {
			window.recipeApp = recipeApp; // TODO: rename the app var to recipeApp
			recipeApp.init();
		} );
	} );