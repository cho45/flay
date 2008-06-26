# Flay is HTTP via Flash library.

Use with crossdomain.xml for cross-site script.

## Usage:

	new Flay.Request({
		url    : "http://example.com/",
		method : "POST",
		data   : "",

		success : function (data) {
			// called with response body
		},

		error : function (message) {
			// called with error message
		},

		complete : function () {
			// called after success or error
		}
	});

with jQuery:

	$.ajax({
		useFlash : true,
		url      : "http://example.com/",
		type     : "post",

		success : function (data) {
		},

		error : function (mes) {
		},

		complete : function () {
		}
	});


----

"Flax".succ #=> "Flay"
