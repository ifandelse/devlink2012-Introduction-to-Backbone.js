/*
	Very simple static view...
 */
define( [
	'backbone',
	'text!views/templates/about.html'
], function ( Backbone, template ) {
	return Backbone.View.extend( {
		el: "#content",

		initialize: function() {
			this.template = template;
		},

		render: function() {
			this.$el.html(this.template);
		}
	} );
} );