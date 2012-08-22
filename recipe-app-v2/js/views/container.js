/*
	Top level view that acts as the container for anything else that backbone will be displaying
 */
define( [
	'infrastructure/backbone/recipe-app-view',
	'underscore',
	'jquery',
    'text!views/templates/container.html'
], function ( RecipeAppView, _, $, template ) {
	return RecipeAppView.extend( {
		el: "body",

		initialize: function() {
			this.template = _.template(template);
		}
	} );
} );