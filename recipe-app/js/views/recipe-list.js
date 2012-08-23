/*
	Fairly straightforward view that manages the display of recipes in the Collection
	that acts as the model to this view.  You'll notice that even though this view has
	no other model instances (only the collection), I still pass it into the template
	rendering function as the member of an object.  This is because in most circumstances
	that I've seen - as an app grows, it becomes necessary for collection views to have
	model data in addition to the collection itself, and having the template expect an
	object allows an easy point in which to simply add the new data that should be displayed.
	Note that calling 'fetch' automatically on init - while convenient - can be dangerous.
 */
define( [
	'backbone',
	'underscore',
	'jquery',
	'models/recipe-list-model',
    'text!views/templates/recipe-list.html'
], function ( Backbone, _, $, RecipeListCollection, template ) {
	return Backbone.View.extend( {
		el: "#content",

		// selectors will be found within the DOM tree under this view's top level element
		events: {
			"click .remove-recipe" : "removeRecipe"
		},

		initialize: function(options) {
			_.bindAll(this); // sets the "this" context for all the methods on this view object to the view itself
			this.template = _.template(template);
			// this is more for convenience - the collection is accessible on the app object
			// but I'm getting a local handle to it for brevity's sake
			recipeApp.models.recipeList = this.collection = new RecipeListCollection();
			this.collection.on("add reset remove", this.render);
			this.collection.fetch(); // not always the wisest of choices in "initialize"
		},

		render: function() {
			this.$el.html(this.template({ recipes: this.collection.toJSON() }));
		},

		removeRecipe: function (e) {
			e.preventDefault();
			var elem = $( e.currentTarget );
			this.collection.remove(this.collection.get(elem.attr("data-val")));
		}
	} );
} );