/*
	I chose to use mockjax so that this app will not require a back-end service layer and data store to run.
 */
define( [
	'jquery',
	'underscore',
	'infrastructure/comm/recipes',
	'mockjax'
], function ( $, _, recipes ) {
	var idSeed = _.toArray( recipes ).length; // Poor man's identity value

	// Mocked response for recipe list
	$.mockjax( {
		url : "/api/recipe",
		type : "GET",
		status : 200,
		response : function ( settings ) {
			this.responseText = JSON.stringify( _.toArray( recipes ) );
		}
	} );

	// Mocked response for GET-ing a recipe
	/*
	 NOTE THAT I AM USING A TWEAKED VERSION OF
	 MOCKJAX SO THAT IT CAN SUPPORT THE STATUS
	 CODE BEING OVERRIDDEN IN THE RESPONSE METHOD
	 */
	$.mockjax( {
		url : /api.recipe.[0-9]{1,2}$/,
		type : "GET",
		response : function ( settings ) {
			var id = settings.url.substr( settings.url.lastIndexOf( "/" ) + 1 ),
				recipe = recipes[id];
			if ( recipe ) {
				this.status = 200;
				this.responseText = JSON.stringify( recipe );
			}
			else {
				this.status = 404;
			}
		}
	} );

	// Mocked response for POST-ing a recipe
	$.mockjax( {
		url : "/api/recipe",
		type : "POST",
		status : 200,
		response : function ( settings ) {
			var id = idSeed++,
				data = JSON.parse( settings.data );
			data.id = id;
			recipes[id] = data;
			this.responseText = JSON.stringify( data );
		}
	} );

	// Mocked response for PUT-ing a recipe
	$.mockjax( {
		url : /api.recipe.[0-9]{1,2}$/,
		type : "PUT",
		status : 200,
		response : function ( settings ) {
			var data = JSON.parse( settings.data );
			recipes[data.id] = data;
			this.responseText = JSON.stringify( data );
		}
	} );

	// Mocked response for DELETE-ing a recipe
	$.mockjax( {
		url : /api.recipe.[0-9]{1,4}$/,
		type : "DELETE",
		status : 200,
		response : function ( settings ) {
			var id = settings.url.substr( settings.url.lastIndexOf( "/" ) + 1 );
			delete recipes[id];
			this.responseText = JSON.stringify( _.toArray( recipes ) );
		}
	} );
} );