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
			$(document).delegate("a.ps-nav", "click", function(e){
				e.preventDefault();
				self.navigate($(this).attr('href'), { trigger: true });
			});
			if(! recipeApp.views.container ) {
				recipeApp.views.container = new ContainerView();
			}
			recipeApp.views.container.render();
		},

		root: function() {
			if( !recipeApp.views.recipeList ) {
				recipeApp.views.recipeList = new RecipeListView();
			}
			recipeApp.views.recipeList.render();
		},

		newRecipe: function() {
			if( !recipeApp.views.currentRecipe ) {
				recipeApp.views.currentRecipe = new RecipeView();
			}
			recipeApp.views.currentRecipe.options.context = "new";
			recipeApp.views.currentRecipe.model = new RecipeModel();
			recipeApp.views.currentRecipe.bound = false;
			recipeApp.views.currentRecipe.render();
		},

		recipe: function(id, context) {
			var self = this;
			if( !recipeApp.views.currentRecipe ) {
				recipeApp.views.currentRecipe = new RecipeView();
			}
			recipeApp.views.currentRecipe.options.context = context || "view";
			recipeApp.views.currentRecipe.model = recipeApp.models.recipeList.get(id);
			recipeApp.views.currentRecipe.bound = false; // used by the RecipeView to determine if events should be delegated
			recipeApp.views.currentRecipe.render();
		},

		about: function() {
			if( !recipeApp.views.about ) {
				recipeApp.views.about = new AboutView();
			}
			recipeApp.views.about.render();
		}
	} );
} );