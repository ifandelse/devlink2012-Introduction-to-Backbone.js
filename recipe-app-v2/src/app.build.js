({
	baseUrl : './',
	dir : '../dist',
	modules : [
		{
			name : 'main'
		}
	],
	inlineText: true,
	optimize: "uglify",
	findNestedDependencies : true,
	removeCombined : true,
	paths : {
		text       : "libs/text",
		backbone   : 'libs/backbone',
		underscore : 'libs/underscore',
		app        : 'infrastructure/app',
		postal     : "libs/postal/postal",
		mockjax    : 'libs/jquery-mockjax-1.4.0',
		aspect     : 'libs/aspect/aspect',
		bus        : 'infrastructure/comm/bus',
		jquery     : "empty:",
		templates  : 'views/templates'
	},
	shim : {
		mockjax : [ 'jquery' ]
	},
	optimizeCss: "standard"
})