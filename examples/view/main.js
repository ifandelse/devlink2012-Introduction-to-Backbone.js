var View1 = Backbone.View.extend( {
		el : "#view1",

		initialize : function () {
			// using the initialize to grab the template
			// text and cache it on the view object
			this.template = $( "#view1Template" ).text();
		},

		render : function () {
			// this.$el provides jQuery object for the view's element
			this.$el.html( this.template );
			// this.$ provides jQuery selector function scoped to the view
			this.$( "em" ).css( { "font-family" : "Verdana", "font-size" : "8pt" } );
		}
	} ),
	View2 = Backbone.View.extend( {

		// used to construct the view's DOM element
		tagName : "div",

		// class applied to the DOM element
		className : "blue-stuff",

		// id applied to the DOM element
		id : "view2",

		events : {
			"click .clickable" : "onClick"
		},

		initialize : function () {
			// using the initialize to grab the template
			// text and cache it on the view object
			this.template = $( "#view2Template" ).text();
		},

		render : function () {
			// this.$el provides jQuery object for the view's element
			this.$el.html( this.template ).appendTo( 'body' );
		},

		// handler wired up via the events hash
		onClick : function ( e ) {
			e.preventDefault();
			this.$( "a" ).after( "<p>aaaand you clicked the link</p>" );
		}
	} ),
	view1,
	view2;

view1 = new View1();
view1.render();

view2 = new View2();
view2.render();