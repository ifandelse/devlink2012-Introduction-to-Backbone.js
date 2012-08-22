define( [
	'infrastructure/backbone/collection-view',
	'underscore',
	'jquery',
	'models/recipe-list-model',
    'text!views/templates/recipe-list.html',
    'views/recipe-item'
], function ( CollectionView, _, $, RecipeListCollection, template, RecipeItem ) {
	return CollectionView.extend( {
		el: "#recipe-list",

		viewType: RecipeItem,

		events: {
			"click #new-recipe" : "addNewRecipe"
		},

		initialize: function() {
			_.bindAll(this);
			this.template = _.template(template);
			this.on("preRender", function() {
				if(!this.viewRendered) {
					this.$el.html(this.template());
					this.viewRendered = true;
				}
			});
			app.models.recipes = this.collection = new RecipeListCollection();
			this.collection.on("add remove reset", function() {
				this.applyPlaceholder();
			}, this);
			this.collection.fetch();
		},

		// overriding default "renderChildAction" behavior
		renderChildAction: function(view, index) {
			view.render();
			this.$("#recipe-items tbody").append(view.$el);
		},

		applyPlaceholder: function() {
			if(this.collection.length) {
				this.$("#no-recipes-placeholder" ).hide();
			} else {
				this.$("#no-recipes-placeholder" ).show();
			}
		},

		addNewRecipe: function() {
			this.vm.showUI("Edit", { context: "new" });
		},

		update: function() {
			//this.collection.fetch();
		}
	} );
} );