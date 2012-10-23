define( [
	'views/about',
	'views/container',
	'views/recipe-list',
	'views/recipe-view',
	'views/recipe-edit'
], function ( About, Container, RecipeList, RecipeView, RecipeEdit ) {
	return {
		load : function ( viewManager ) {
			viewManager.registerViews( [
				{ name : "About",      ctor : About      },
				{ name : "Container",  ctor : Container  },
				{ name : "RecipeList", ctor : RecipeList },
				{ name : "RecipeView", ctor : RecipeView },
				{ name : "RecipeEdit", ctor : RecipeEdit }
			] );

			viewManager.defineUIs( [
				{ name : "Home",  dependencies : [ "Container", "RecipeList" ], options : {} },
				{ name : "About", dependencies : [ "Container", "About"      ], options : {} },
				{ name : "View",  dependencies : [ "Container", "RecipeView" ], options : {} },
				{ name : "Edit",  dependencies : [ "Container", "RecipeEdit" ], options : {} }
			] );

		}
	};
} );
