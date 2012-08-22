define([
	'backbone',
    'bus'
], function(Backbone, bus){
	return Backbone.View.extend({

		// Reduces method signature when switching UIs.
		// ex: this.vm.showUI('dashboardUI', {});
		vm : {
			// Shows another UI, allowing optional context args
			showUI : function (uiName, options) {
				bus.ui.publish({
					topic : "ui.show",
					data : {
						name : uiName,
						options : options
					}
				});
			}
		},

		// Similar idea to what backbone.marionette does, but tweaked.
		// This provides base "toJSON()" behavior for any view to call
		// for default-approach binding of model data to template, etc.
		dataToJSON: function() {
			var data;
			if (this.model) {
				data = this.model.toJSON();
			}
			if (this.collection) {
				data = {items: this.collection.toJSON()};
			}

			return data;
		},

		render: function(context) {
			this.trigger('preRender', context);
			this.$el.html(this.template(this.dataToJSON()));
			this.trigger('rendered', context);
			return this;
		},

		// Default "show" functionality.
		show: function (context) {
			this.$el.show();
			this.trigger("shown", context);
		},

		// Default "hide" functionality.
		hide: function (context) {
			this.$el.hide();
			this.trigger("hidden", context);
		},

		// Default "remove" functionality.
		remove: function() {
			this.undelegateEvents();
			this.$el.remove();
			return this;
		}
	})
});