define([
	'underscore',
	'infrastructure/backbone/recipe-app-view'
], function (_, RecipeAppView) {
	return RecipeAppView.extend({

		// Constructor method for the views inheriting from CollectionView.
		constructor : function () {
			RecipeAppView.prototype.constructor.apply(this, arguments);

			// Object that will hold child views.
			this.childViews = {};

			// Set "reset" & "add" listeners on the collection.
			if(this.collection) {
				this.collection.on("reset",  this.render,      this);
				this.collection.on("add",    this.addChild,    this);
				this.collection.on("remove", this.removeChild, this);
			}
			_.bindAll(this, "getViewCtor", "addChild", "removeChild", "remove", "removeChildren", "renderChildAction");
		},

		// Verifies that an added model has a viewType defined.
		getViewCtor : function (model) {
			var viewType = this.options.viewType || this.viewType;
			if (!viewType) {
				throw new Error("A `viewType` must be specified");
			}
			return viewType;
		},

		// Initializes view for each model within the collection.
		addChild : function (model) {
			var idx = this.collection.indexOf(model);
			var ViewCtor = this.getViewCtor(model);
			var view = new ViewCtor({ model: model });
			this.childViews[view.model.cid] = view;
			this.renderChildAction(view, idx);
		},

		// Calls the render method on each view instance and appends
		// the rendered child view to the parent container.
		renderChildAction: function(view, index) {
			view.render();
			this.$el.append(view.$el);
		},

		// Removes a child from childViews object.
		// item arg is the **model** getting removed
		removeChild : function (model) {
			if (this.childViews[model.cid]) {
				this.childViews[model.cid].remove();
				delete this.childViews[model.cid];
			}
		},

		// Removal of a child view is delegated to the view
		// itself, and that is controlled by that view's model
		removeChildView: function(item) {
			this.removeChild(item.model);
		},

		// Removes children from the childViews object.
		removeChildren: function() {
			_.each(this.childViews, this.removeChildView, this);
		},

		// Removes references to child views from the DOM.
		remove : function () {
			this.removeChildren();
			this.undelegateEvents();
			this.$el.remove();
			return this;
		},

		// Removes existing children. Once removed, the collection
		// is iterated over and each model within the collection is rendered.
		render: function(context) {
			this.trigger('preRender', context);
			this.removeChildren();
			this.collection.forEach(function(item){
				this.addChild(item);
			}, this);
			this.trigger('rendered', context);
		}
	});
});