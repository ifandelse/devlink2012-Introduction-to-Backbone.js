define( [
	'infrastructure/backbone/recipe-app-view',
	'underscore',
	'jquery',
	'text!views/templates/recipe-edit.html',
	'text!views/templates/items-template.html',
	'text!views/templates/steps-template.html',
	'text!views/templates/error.html',
    'models/recipe-model'
], function ( RecipeAppView, _, $, template, itemsTemplate, stepsTemplate, errorTemplate, RecipeModel ) {
	return RecipeAppView.extend( {
		el : "#recipe-edit",

		events : {
			"click #addCancel"        : "onGoBack",
			"click #saveCancel"       : "onGoBack",
			"click #addNew"           : "onAddNewRecipe",
			"click #btnAddItem"       : "onAddItem",
			"click #btnAddStep"       : "onAddStep",
			"click .item-remove"      : "onRemoveItem",
			"change .text-updateable" : "updateValueFromDom",
			"click #updateRecipe"     : "updateRecipe"
		},

		initialize : function ( options ) {
			_.bindAll( this );
			this.options = options;
			this.templates = {
				main  : _.template( template ),
				items : _.template( itemsTemplate ),
				steps : _.template( stepsTemplate ),
				error : _.template( errorTemplate )
			};
			this.setUpModel();
		},

		onAddItem : function () {
			this.onAdd( "items" );
		},

		onAddNewRecipe : function () {
			this._context = "new";
			this.model.save();
		},

		onAddStep : function () {
			this.onAdd( "steps" );
		},

		onAdd : function ( list ) {
			var elem = this.$el.find( "#" + list + "_add" ),
				val = elem.val();
			elem.val( "" );
			this.model.set( list, this.model.get( list ).concat( val ), { silent: true } );
			this.model.change();
			elem.focus();
		},

		onGoBack : function () {
			// Oh, the hackishness....it burns
			if(this._context && this._context === "new") {
				this._context = "";
				this.vm.showUI("Home");
			} else {
				history.back();
			}
		},

		onRemoveItem : function ( e ) {
			e.preventDefault();
			var elem = $( e.currentTarget ),
				list = elem.attr( "data-list" ),
				idx = elem.attr( "data-val" ),
				mdl = _.clone( this.model.get( list ) );
			mdl.splice( idx, 1 );
			this.model.set( list, mdl, { silent: true } );
			this.render();
		},

		render : function ( options ) {
			this.$el.html( this.templates.main( this.model.toJSON() ) );
			this.renderItems();
			this.renderSteps();
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
			this.model.on( "change", this.render );
			this.model.on( "error", this.showErrors );
			this.model.on( "sync", function() {
				this.onGoBack();
			}, this);
			this.model.CONTEXT = "EDIT";
		},

		showErrors : function ( model, errors ) {
			var _errors = _.flatten(errors);
			if ( _errors && _errors.length ) {
				this.$( "#errors" ).html( this.templates.error( { errors: _errors } ) );
				return;
			}
			this.$( "#errors" ).html( "" );
		},

		update: function( options ) {
			var model;
			this.priorUI = options.priorContext;
			this.model.reset( { silent: true } );
			if( options.recipeId ) {
				if( model = app.models.recipes.get( options.recipeId )) {
					this.model.set( _.deepExtend({}, model.toJSON() ));
				}
			} else {
				this.model.change();
			}
		},

		updateValueFromDom : function ( e ) {
			var elem = $( e.currentTarget );
			this.model.set( elem.attr( "id" ), elem.val(), { silent: true } );
		},

		updateRecipe : function () {
			var self = this;
			self.model.save();
		}
	} );
} );