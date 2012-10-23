define( [
	'backbone',
	'underscore',
	'infrastructure/backbone/recipe-app-view',
	'text!views/templates/recipe-item.html'
], function ( Backbone, _, RecipeAppView, template ) {
	return RecipeAppView.extend( {
		tagName : "tr",

		events: {
			"click .remove-recipe" : "removeRecipe"
		},

		initialize : function () {
			_.bindAll( this );
			this.template = _.template(template);
			this.model.on("change", this.render, this);
		},

		removeRecipe: function (e) {
			e.preventDefault();
			this.model.destroy();
		}
	} );
} );