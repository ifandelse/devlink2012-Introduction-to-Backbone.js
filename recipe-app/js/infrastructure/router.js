/*
	This module contains perhaps one of the worst dangers in the sample app: View Management
	being handled by the Router.  I typically see this happen in the router, or spread out
	across various views themselves.  View lifecycle management is a serious concern in any
	client side architecture, and it's very difficult to provide something that isn't *so*
	opinionated that it proves to not be flexible enough for many situations, but placing
	this logic in the router is a solution that will **not** scale much at all beyond a small
	handful of views.  Of all the dangers, I see this repeated the most in Backbone applications
	that I've run across.
 */
define( [
	'backbone',
	'jquery',
    'views/container',
    'views/recipe-list',
    'views/recipe',
    'views/about',
    'models/recipe-model'
], function ( Backbone, $, ContainerView, RecipeListView, RecipeView, AboutView, RecipeModel ) {
	return Backbone.Router.extend( {
		routes: {
			""                          : "root",
			"recipe/new"                : "newRecipe",
			"recipe/:recipeId/:context" : "recipe",
			"recipe/:recipeId"          : "recipe",
			"about"                     : "about"
		},

		initialize: function(options) {
			var self = this;
			self.options = options;
			$(document).delegate("a.ps-nav", "click", function(e){
				e.preventDefault();
				self.navigate($(this).attr('href'), { trigger: true });
			});
			if(! self.options.recipeApp.views.container ) {
				self.options.recipeApp.views.container = new ContainerView({ recipeApp: self.options.recipeApp });
			}
			self.options.recipeApp.views.container.render();
		},

		root: function() {
			if( !this.options.recipeApp.views.recipeList ) {
				this.options.recipeApp.views.recipeList = new RecipeListView({ recipeApp: this.options.recipeApp });
			}
			this.options.recipeApp.views.recipeList.render();
		},

		newRecipe: function() {
			if( !this.options.recipeApp.views.currentRecipe ) {
				this.options.recipeApp.views.currentRecipe = new RecipeView({ recipeApp: this.options.recipeApp });
			}
			this.options.recipeApp.views.currentRecipe.options.context = "new";
			this.options.recipeApp.views.currentRecipe.model = new RecipeModel();
			this.options.recipeApp.views.currentRecipe.bound = false;
			this.options.recipeApp.views.currentRecipe.render();
		},

		recipe: function(id, context) {
			var self = this;
			if( !self.options.recipeApp.views.currentRecipe ) {
				self.options.recipeApp.views.currentRecipe = new RecipeView({ recipeApp: self.options.recipeApp });
			}
			self.options.recipeApp.views.currentRecipe.options.context = context || "view";
			self.options.recipeApp.views.currentRecipe.model = this.options.recipeApp.models.recipeList.get(id);
			this.options.recipeApp.views.currentRecipe.bound = false;
			this.options.recipeApp.views.currentRecipe.render();
		},

		about: function() {
			if( !this.options.recipeApp.views.about ) {
				this.options.recipeApp.views.about = new AboutView();
			}
			this.options.recipeApp.views.about.render();
		}
	} );
} );