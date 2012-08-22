/*
	I chose to use mockjax so that this app will not require a back-end service layer and data store to run.
 */
define( [
	'jquery',
	'underscore',
	'mockjax'
], function ( $, _ ) {
	var recipes = {
			0 : {
				id : 0,
				title : "Frozen Captain",
				description : "Ice Cream + Cap'n Crunch and more",
				items : [
					"Your favorite ice cream flavor",
					"Minimum 1-2 Cups of Cap'n Crunch cereal",
					"Chocolate syrup"
				],
				steps : [
					"Fill a bowl with generous amounts of your favorite ice cream.",
					"Pour a minimum 1-1 1/2 cups of Capn' Crunch cereal over the top of the ice cream.",
					"Drizzle chocolate syrup to desired amount over top of bowl.",
					"Enjoy!"
				]
			},
			1 : {
				id : 1,
				title : "'Pretend You're Not on Paleo' Toast",
				description : "Toast that keeps a paleo guy sane",
				items : [
					"Toaster Oven",
					"Minimum 1 slice of gluten-free bread",
					"At least half a tablespoon of real butter",
					"1-3 tablespoons of organic strawberry preserves"
				],
				steps : [
					"Spread a generous amount of butter on the slice of bread",
					"Place the bread in the toaster oven. Be sure and watch the butter melt, as this helps convince the brain it's *real* bread",
					"Once the bread is starting to turn golden brown, remove from toaster oven.",
					"Spread a generous amount of the strawberry preserves over the toast",
					"Ignore the sugar content of the preserves, and convince yourself that the gluten free bread and natural fat from the butter is all that matters",
					"Consider having a slice of bacon with the toast. Bacon is paleo. Bacon is good. Bacon is BACON.",
					"Repeat as necessary"
				]
			},
			2 : {
				id : 2,
				title : "Awesome Sauce",
				description : "It's epic beyond words...",
				items : [
					"Awesome",
					"Sauce",
					"Lots and lots of time. LOTS."
				],
				steps : [
					"1 Cup of Awesome",
					"1 Cup of Sauce",
					"Stir for about 10 years - until blended smooth.",
					"Consume quickly - only lasts about 10 minutes"
				]
			}
		},
		idSeed = _.toArray( recipes ).length; // Poor man's identity value

	// Mocked response for recipe list
	$.mockjax( {
		url : "/api/recipe",
		type : "GET",
		status : 200,
		response : function ( settings ) {
			this.responseText = JSON.stringify( _.toArray( recipes ) );
		}
	} );

	// Mocked response for GET-ing a recipe
	/*
	 NOTE THAT I AM USING A TWEAKED VERSION OF
	 MOCKJAX SO THAT IT CAN SUPPORT THE STATUS
	 CODE BEING OVERRIDDEN IN THE RESPONSE METHOD
	 */
	$.mockjax( {
		url : /api.recipe.[0-9]{1,2}$/,
		type : "GET",
		response : function ( settings ) {
			var id = settings.url.substr( settings.url.lastIndexOf( "/" ) + 1 ),
				recipe = recipes[id];
			if ( recipe ) {
				this.status = 200;
				this.responseText = JSON.stringify( recipe );
			}
			else {
				this.status = 404;
			}
		}
	} );

	// Mocked response for POST-ing a recipe
	$.mockjax( {
		url : "/api/recipe",
		type : "POST",
		status : 200,
		response : function ( settings ) {
			var id = idSeed++,
				data = JSON.parse( settings.data );
			data.id = id;
			recipes[id] = data;
			this.responseText = JSON.stringify( data );
		}
	} );

	// Mocked response for PUT-ing a recipe
	$.mockjax( {
		url : /api.recipe.[0-9]{1,2}$/,
		type : "PUT",
		status : 200,
		response : function ( settings ) {
			var data = JSON.parse( settings.data );
			recipes[data.id] = data;
			this.responseText = JSON.stringify( data );
		}
	} );

	// Mocked response for DELETE-ing a recipe
	$.mockjax( {
		url : /api.recipe.[0-9]{1,4}$/,
		type : "DELETE",
		status : 200,
		response : function ( settings ) {
			var id = settings.url.substr( settings.url.lastIndexOf( "/" ) + 1 );
			delete recipes[id];
			this.responseText = JSON.stringify( _.toArray( recipes ) );
		}
	} );
} );