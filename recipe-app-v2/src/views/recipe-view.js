define( [
	'infrastructure/backbone/recipe-app-view',
	'underscore',
	'jquery',
	'text!views/templates/recipe-view.html',
	'text!views/templates/items-template.html',
	'text!views/templates/steps-template.html',
    'models/recipe-model'
], function ( RecipeAppView, _, $, template, itemsTemplate, stepsTemplate, RecipeModel ) {
	return RecipeAppView.extend( {
		el : "#recipe-view",

		events : {
			"click #addCancel"        : "onGoBack"
		},

		initialize : function () {
			_.bindAll( this );
			this.template = _.template( template );
			this.templates = {
				items : _.template( itemsTemplate ),
				steps : _.template( stepsTemplate )
			};
			this.setUpModel();
		},

		onGoBack : function () {
			history.back();
		},

		renderItems : function () {
			this.renderList( "items" );
		},

		renderSteps : function () {
			this.renderList( "steps" );
		},

		renderList : function ( list ) {
			var items = this.templates[list]( { items : this.model.get( list ) } );
			this.$( "#" + list ).replaceWith( items );
		},

		setUpModel : function () {
			this.model = new RecipeModel();
			this.model.bind( "change", this.render );
			this.model.CONTEXT = "VIEW";
		},

		update: function( options ) {
			var model;
			this.priorUI = options.priorContext;
			this.model.reset( { silent: true } );
			if( options.recipeId ) {
				if( model = app.models.recipes.get( options.recipeId )) {
					this.model.set( _.deepExtend({}, model.toJSON() ));
				}
			}
		}
	} );
} );