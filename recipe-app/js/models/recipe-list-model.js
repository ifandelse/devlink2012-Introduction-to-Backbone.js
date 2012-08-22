/*
	Collection model.  Note that we've set the url property.  We're using the
	built in Backbone.sync logic, so items in this collection will pass their
	ids as the last segment (e.g. /api/recipe/12).  Note how Backbone provides
	a *ton* of functionality, while this is minimal code!
 */
define( [
	'backbone',
	'jquery',
    'models/recipe-model'
], function ( Backbone, $, RecipeModel ) {
	return Backbone.Collection.extend( {
		url: "/api/recipe",

		model: RecipeModel
	} );
} );