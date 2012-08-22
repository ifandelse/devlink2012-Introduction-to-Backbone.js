/*
    Recipe model.  This provides the model instance for both existing recipes
    that live in the recipe-list-collection, but also stand alone instance for
    creating a new recipe.  If this model is being used to create a *new* recipe,
    the result (once validation passes) is "toJSON()-ed" and passed into the "add"
    method on the collection, and then this instance is cleared.
 */
define( [
	'backbone',
	'jquery'
], function ( Backbone, $ ) {
	return Backbone.Model.extend( {

		//urlRoot: "/api/recipe",

		defaults: {
			id: null, // For Backbone to consider this a new model, use undefined or null
			title: "",
			description: "",
			items: [],
			steps: []
		},

		// simple function to capture the state of a model
		getMemento: function() {
			this.memento = this.toJSON();
		},

		// if we've stored a memento, this can reset the model back to that state
		applyMemento: function() {
			if(this.memento) {
				this.set(this.memento);
			}
		},

		/*
			One of the hidden gotchas of the built in validation logic
			(hidden in _validate, which in turn calls your implementation
			of validate) is that the entire model's attribute are passed
			in, and not just the value(s) you are setting.  You can avoid
			an invalid model from keeping your values from being set by
			providing the { silent: true } option, but I personally find
			that frustrating!
		 */
		validate: function(attrs) {
			var errors = [];
			if(!attrs.title) {
				errors.push("You must include a title.")
			}
			if(!attrs.description) {
				errors.push("You must include a description.")
			}
			if(!attrs.items.length) {
				errors.push("You must include at least one required item.")
			}
			if(!attrs.steps.length) {
				errors.push("You must include at least one step.")
			}
			if(errors.length) {
				return { errors: errors };
			}
		}
	} );
} );