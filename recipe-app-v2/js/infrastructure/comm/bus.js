define( [
	'postal'
], function ( postal ) {
	window.postal = postal;

	var dataChannel = postal.channel( "data", "*" ),
		uiChannel = postal.channel( "ui", "*" ),
		commChannel = postal.channel( "comm", "*" );

	return {
		data : dataChannel,
		ui   : uiChannel,
		comm : commChannel
	};
} );