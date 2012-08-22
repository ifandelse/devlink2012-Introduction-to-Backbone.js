define( [
	'infrastructure/backbone/recipe-app-model',
	'jquery'
], function ( RecipeAppModel, $ ) {

	var isRequired = function(val) {
		return _.isArray(val) ? !!val.length : !!val;
	};

	return RecipeAppModel.extend( {

		urlRoot: "/api/recipe",

		defaults: function() {
			return {
				id          : null, // For Backbone to consider this a new model, use undefined or null
				title       : "",
				description : "",
				items       : [],
				steps       : [],
				context     : "new"
			};
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

		rules : {
			title       : [ { predicate: isRequired, errorMsg: "You must include a title."                    } ],
			description : [ { predicate: isRequired, errorMsg: "You must include a description."              } ],
			items       : [ { predicate: isRequired, errorMsg: "You must include at least one required item." } ],
			steps       : [ { predicate: isRequired, errorMsg: "You must include at least one step."          } ]
		}
	} );
} );