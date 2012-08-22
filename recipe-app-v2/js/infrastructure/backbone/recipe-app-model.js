define([
	'backbone',
	'bus'
], function(Backbone, bus){
	return Backbone.Model.extend({
		constructor: function(attributes, options) {
			this.on("change:id", this.setSubscriptions);
			Backbone.Model.prototype.constructor.call(this, attributes, options);
			this.on("sync", function(model, resp, options){
				bus.data.publish({
					topic: this.url() + ".sync",
					cid: this.cid,
					data: model.toJSON()
				})
			}, this);
		},

		reset: function(options) {
			var defaults = this.defaults;
			if(typeof this.defaults === "function") {
				defaults = this.defaults();
			}
			this.set(defaults, options);
		},

		validate: function (attributes) {
			if(this.rules) {
				var targetState = _.extend(this.toJSON(), attributes);
				this.set("_errors", {}, { silent: true });
				var errors = {};
				_.each(attributes, function (value, key) {
					if(this.rules[key]){
						var val = _.isArray(value) ? value : $.trim(value);
						var idx = 0;
						var pass;
						for(; idx < this.rules[key].length; idx++) {
							(function(rule){
								rule = rule.predicate ? rule : { predicate: rule, errorMsg: "The 'key' has validation errors." };
								pass = rule.predicate.call(this, val, targetState);
								var msg = rule.errorMsg;
								if(Object.prototype.toString.call(pass) === '[object String]') {
									msg = pass || rule.errorMsg;
									pass = !pass; // if we got a string back, it's an error message, so the field failed the predicate
								}
								if (!pass) {
									if(!errors[key]) {
										errors[key] = new Array();
									}
									errors[key].push(msg);
								}
							})(this.rules[key][idx]);
							if(!pass && this.rules[key][idx].stopIfBroken) {
								break;
							}
						}
					}
				}, this);
				this.set("_errors", errors, { silent: true });
				// Return only when errors exist.
				if (!_.isEmpty(errors)) {
					return errors;
				}
			}
		},

		hasErrors: function() {
			return !_.isEmpty(this.get("_errors"));
		},

		routeDataEvent: function(data, envelope) {
			var meta = envelope.topic.split('.');
			if(meta[1] === 'sync') {
				this.set(data);
			}
		},

		setSubscriptions: function() {
			var self = this;
			self.subscriptions = self.subscriptions || {};
			if(self.subscriptions._sync) {
				self.subscriptions._sync.unsubscribe();
			}
			self.subscriptions._sync = bus.data.subscribe(self.url() + ".*", self.routeDataEvent)
				.withConstraint(function(d, e){
					return e.cid !== self.cid;
				})
				.withContext( self );
		}
	});
});