define( [
	'backbone',
	'jquery',
    'bus'
], function ( Backbone, $, bus ) {
	return Backbone.Router.extend( {
		routes: {
			""                      : "root",
			"recipe/new"            : "editRecipe",
			"recipe/:recipeId/edit" : "editRecipe",
			"recipe/:recipeId"      : "recipe",
			about                   : "about"
		},

		initialize: function(options) {
			var self = this;
			$(document).delegate("a.ps-nav", "click", function(e){
				e.preventDefault();
				self.navigate($(this).attr('href'), { trigger: true });
			});
		},

		// Show another UI and allow for optional context.
		// Reduces method signature when switching UIs.
		// ex: this.activateUI('dashboardUI');
		activateUI : function ( uiName, options ) {
			bus.ui.publish( {
				topic : "ui.show",
				data : {
					name : uiName,
					options : options
				}
			} );
		},

		root: function() {
			this.activateUI("Home");
		},

		editRecipe: function(id) {
			this.activateUI("Edit", { recipeId: id || null });
		},

		recipe: function(id, context) {
			this.activateUI("View", { recipeId: id });
		},

		about: function() {
			this.activateUI("About");
		}
	} );
} );