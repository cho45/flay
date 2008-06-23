

Flay = { };
Flay.Request = function (url, opts) { this.init(url, opts) };
Flay.Request.swf       = 'Flay.swf';
Flay.Request.swfid     = 'externalInterfaceFlay';
Flay.Request.id        = 0;
Flay.Request.requests  = {};
Flay.Request.loaded    = false;
Flay.Request.prototype = {
	init : function (opts) {
		var as = navigator.userAgent.match(/MSIE/) ? window[Flay.Request.swfid] : document[Flay.Request.swfid];
		setTimeout(function () {
			if (Flay.Request.loaded) {
				var id = Flay.Request.id++;
				Flay.Request.requests[id] = opts;
				as.request(id, opts);
			} else {
				setTimeout(arguments.callee, 10);
			}
		}, 10);
	}
};
Flay.Request.insertSwf = function() {
	if (Flay.Request.loaded) return;

	var html = [
		'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="1" height="1" id="' + Flay.Request.swfid + '" align="middle">',
			'<param name="allowscriptaccess" value="always" />',
			'<param name="movie" value="' + Flay.Request.swf + '" />',
			'<param name="quality" value="high" />',
			'<param name="bgcolor" value="#ffffff" />',
			'<embed src="' + Flay.Request.swf + '" quality="high" bgcolor="#ffffff" width="1" height="1" name="' + Flay.Request.swfid + '" align="middle" allowscriptaccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />',
		'</object>'
	];

	var div = document.createElement('div');
	with (div.style) {
		width   = "0px";
		height  = "0px";
		margin  = "0";
		padding = "0";
		border  = "none";
	}
	document.body.appendChild(div);
	div.innerHTML = html.join('');
};
Flay.Request.callback = function (id, res) {
	console.log(id, res);
	if (res.error) {
		Flay.Request.requests[id].error(res.error);
	} else {
		Flay.Request.requests[id].success(res.data);
	}
	delete Flay.Request.requests[id];
};
Flay.Request.loadedcb = function () {
	Flay.Request.loaded = true;
};


