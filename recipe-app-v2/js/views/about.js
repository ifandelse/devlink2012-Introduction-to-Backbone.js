/*
	Very simple static view...
 */
define( [
	'infrastructure/backbone/recipe-app-view',
	'text!views/templates/about.html'
], function ( RecipeAppView, template ) {
	return RecipeAppView.extend( {
		el: "#about",

		initialize: function() {
			this.template = _.template(template);
		}
	} );
} );