define( [
	'backbone',
	'jquery',
    'models/recipe-model',
    'bus'
], function ( Backbone, $, RecipeModel, bus ) {
	return Backbone.Collection.extend( {
		url: "/api/recipe",

		model: RecipeModel,

		initialize: function() {
			this.setSubscriptions();
		},

		routeDataEvent: function(data, envelope) {
			var meta = envelope.topic.split('.');
			if(meta[1] === 'sync') {
				var target = this.get(data.id);
				if(target) {
					target.set(data);
				} else {
					this.fetch();
				}
			}
		},

		setSubscriptions: function() {
			var self = this;
			self.subscriptions = self.subscriptions || {};
			if(self.subscriptions._sync) {
				self.subscriptions._sync.unsubscribe();
			}
			self.subscriptions._sync = bus.data.subscribe(self.url + "*", self.routeDataEvent).withContext( self );
		}
	} );
} );