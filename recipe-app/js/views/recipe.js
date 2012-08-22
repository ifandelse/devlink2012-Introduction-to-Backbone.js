/*
	This is the most involved view object the sample app.  It includes a mixture of
	good and bad approaches (all items I've seen in other apps, or been guilty of myself!).

	1.) A choice is being made to reuse the recipe view instance, but for the model to be changed
		out if a new recipe is being added vs an existing one being edited.  While this approach
		is reasonable - it comes with challenges.  You'll notice this view feeds a JSON-ized result
		of a *new* recipe model to the recipe collection (which constructs a proper Recipe model instance
		upon it being added to the list), but this view's model instance is NOT added to the collection
		itself.
	2.) Backbone provides great flexibility in allowing you to use the template engine of your choice.  However,
		control over rendering partials is left entirely up to you.  If your template engine doesn't support that
		out-of-the-box, then you have to implement that yourself.  While this is often a preferred approach (to
		avoid unnecessary re-rendering of input elements, flashing of content, and overall performance loss), it
		can lead to an explosion of methods (this view has 3 render-related methods).
	3.) This view acts as both a "view" and "edit" context for a recipe.  In most people's minds this would be the
		"DRY" approach - but I'd argue that this view could be split out into separate components with more clearly
		defined responsibilities (view vs edit in separate backbone views), without about the same amount of code
		that exists in order to support this view changing context.
	4.) Because of the choice being made in #1 and because of how Backbone's validation works, many of the model
		"set" calls are using the { silent: true } option - so that Backbone will allow the particular property to
		be set without the rest of the model passing validation.  Once the user attempts to add the new recipe,
		this view gets the JSON-ized model data and manually validates it, capturing the errors and rendering them.
		I personally find this frustrating - not only the 'validate all the model' with each set operation, but I
		would prefer to have a validation summary view that would subscribe (via a message bus) to validation error
		messages. The model in question could still manage its own "can I persist or not?" concerns, but validation
		notices could be handled by another view (which could then be reused throughout the app).
 */
define( [
	'backbone',
	'underscore',
	'jquery',
	'text!views/templates/recipe.html',
	'text!views/templates/items-template.html',
	'text!views/templates/steps-template.html',
	'text!views/templates/error.html'
], function ( Backbone, _, $, template, itemsTemplate, stepsTemplate, errorTemplate ) {
	return Backbone.View.extend( {
		el : "#content",

		events : {
			"click #addCancel"        : "onCancel",
			"click #addNew"           : "onAddNewRecipe",
			"click #btnAddItem"       : "onAddItem",
			"click #btnAddStep"       : "onAddStep",
			"click .item-remove"      : "onRemoveItem",
			"change .text-updateable" : "updateValueFromDom",
			"click #editRecipe"       : "editRecipe",
			"click #updateRecipe"     : "updateRecipe",
			"click #viewRecipe"       : "viewRecipe"
		},

		initialize : function ( options ) {
			_.bindAll( this );
			this.options = options;
			this.templates = {
				main : _.template( template ),
				items : _.template( itemsTemplate ),
				steps : _.template( stepsTemplate ),
				error : _.template( errorTemplate )
			};
		},

		editRecipe : function () {
			this.model.getMemento();
			this.setContext( "edit" );
		},

		onAddItem : function () {
			this.onAdd( "items" );
		},

		onAddNewRecipe : function () {
			var self = this,
				model = self.model.toJSON(),
				errors = self.model.validate( model );
			self.showErrors( errors );
			if ( !errors ) {
				self.options.recipeApp.models.recipeList.add( model, { silent : true } );
				self.options.recipeApp.models.recipeList.last().save( { wait : true }, {
					success : function () {
						self.options.recipeApp.router.navigate( "", { trigger : true } );
						self.model.clear( { silent : true } );
					}
				} );
			}
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

		onCancel : function () {
			history.back();
		},

		onRemoveItem : function ( e ) {
			e.preventDefault();
			var elem = $( e.currentTarget ),
				list = elem.attr( "data-list" ),
				idx = elem.attr( "data-val" ),
				mdl = _.clone( this.model.get( list ) );
			mdl.splice( idx, 1 );
			this.model.set( list, mdl );
		},

		render : function () {
			this.setUpModel();
			var model = _.extend( {}, this.model.toJSON(), { context : this.options.context } );
			this.$el.html( this.templates.main( model ) );
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

		setContext : function ( context ) {
			this.options.context = context;
			this.render();
		},

		setUpModel : function () {
			if ( !this.bound ) {
				this.model.bind( "change:items", this.renderItems );
				this.model.bind( "change:steps", this.renderSteps );
				this.model.bind( "error", this.showErrors );
				this.bound = true;
			}
		},

		showErrors : function ( validation ) {
			if ( validation && validation.errors && validation.errors.length ) {
				this.$( "#errors" ).html( this.templates.error( validation ) );
				return;
			}
			this.$( "#errors" ).html( "" );
		},

		updateValueFromDom : function ( e ) {
			var elem = $( e.currentTarget );
			this.model.set( elem.attr( "id" ), elem.val(), { silent: true } );
		},

		updateRecipe : function () {
			var self = this;
			self.model.save( { wait : true }, {
				success : function () {
					self.options.recipeApp.router.navigate( "", { trigger : true } );
				}
			} );
		},

		viewRecipe : function () {
			this.model.applyMemento();
			this.setContext( "view" );
		}
	} );
} );