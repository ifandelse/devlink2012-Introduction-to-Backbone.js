var PersonModel = Backbone.Model.extend({
		// default values for the model
		defaults: {
			firstName: "",
			lastName: "",
			company: "",
			position: ""
		},

		// a simple validation function
		validate: function(attrs) {
			var errors = [];
			if (!attrs.firstName) {
				errors.push("I kinda need to know what to call you. First Name maybe?");
			}
			if (!attrs.lastName) {
				errors.push("What - they don't have last names where you come from?");
			}
			if (errors.length) {
				return errors;
			}
		}
	}),
	PersonView = Backbone.View.extend({
		el: "#content",

		events: {
			"click #btnUpdate": "updateModel"
		},

		initialize: function() {
			// using the initialize to grab the template
			// text and cache it on the view object
			this.template = _.template($("#personTemplate").text());
			// the view subscribes to when the model triggers validation errors
			this.model.on("error", this.handleError);
			this.model.on("change", function() { alert('model successfully updated.') });
		},

		render: function() {
			// this.$el provides jQuery object for the view's element
			this.$el.html(this.template(this.model.toJSON()));
		},

		// function that manually grabs the DOM input element values
		// and then attempts to set the model's properties
		updateModel: function() {
			var attrs = {
				firstName: this.$("#firstName").val(),
				lastName: this.$("#lastName").val(),
				company: this.$("#company").val(),
				position: this.$("#position").val()
			};
			this.model.set(attrs);
			// could also set values like this
			//this.model.set("firstName", this.$("#firstName").val());
			var firstName = this.model.get("firstName")
		},

		// How the view responds to the model validation error event
		handleError: function(model, errors) {
			alert(errors.join("\n"));
		}
	}),
	person;

person = new PersonView({
	model: new PersonModel({
		firstName: "Ralph",
		lastName: "Whitbeck",
		company: "appendTo",
		position: "resident genius and smart aleck"
	})
});

person.render();