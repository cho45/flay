
Flay = new Object;
Flay.Request = function (url, opts) { this.init(url, opts) };
Flay.Request.opts = (function () {
	// flay.js#SWF=/path/to/Flay.swf
	// flay.js#SWF=/shared/js/lib/Flay.swf
	var opts = {};
	var scripts = document.getElementsByTagName('script');
	var script  = scripts[scripts.length - 1];
	if (script.src.match(/#(.+)/)) {
		var list = RegExp.$1.split(',');
		for (var j = 0; j < list.length; j++) {
			var kv = list[j].split('=');
			opts[kv[0]] = kv[1];
		}
	}
	return opts
})();
Flay.Request.swf       = Flay.Request.opts.SWF;
Flay.Request.swfid     = 'externalInterfaceFlay';
Flay.Request.id        = 0;
Flay.Request.requests  = {};
Flay.Request.loaded    = false;
Flay.Request.loadedcb  = function () { Flay.Request.loaded = true };
Flay.Request.callback  = function (id, res) {
	var self = Flay.Request.requests[id];
	if (res.error) {
		self.opts.error(res.error);
	} else {
		self.opts.success(res.data);
	}
	self.opts.complete();
	delete Flay.Request.requests[id];
};
Flay.Request.insertSwf = function() {
	if (Flay.Request.loaded) return;

	// if SWFObject exists, check player version
	if (window["deconcept"] && deconcept.SWFObjectUtil && deconcept.SWFObjectUtil.getPlayerVersion) {
		var major = deconcept.SWFObjectUtil.getPlayerVersion().major;
		if (+major < 9) throw Error("require Flash Player 9 or later");
	}

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
		position = "absolute";
		top     = "0";
		left    = "0";
		width   = "0";
		height  = "0";
		margin  = "0";
		padding = "0";
		border  = "none";
	}
	document.body.appendChild(div);
	div.innerHTML = html.join('');
};
Flay.Request.prototype = {
	init : function (opts) {
		var self = this; self.id = Flay.Request.id++;
		var as = navigator.userAgent.match(/MSIE/) ? window[Flay.Request.swfid] : document[Flay.Request.swfid];

		self.opts  = {
		//	url      : "",
		//	data     : null,
			method   : "GET",
			success  : function () { },
			error    : function () { },
			complete : function () { }
		};

		for (var k in opts) if (opts.hasOwnProperty(k)) {
			self.opts[k] = opts[k];
		}

		// waiting for loading swf
		setTimeout(function () {
			if (Flay.Request.loaded) {
				Flay.Request.requests[self.id] = self;
				as.request(self.id, opts);
			} else {
				setTimeout(arguments.callee, 10);
			}
		}, 10);
	}
};


if (typeof window["jQuery"] != "undefined") {
	// Must be loaded after any $.ajax hacks.
	(function ($) {
		$(function () { Flay.Request.insertSwf() });
		_ajax = $.ajax;
		$.ajax = function (opts) {
			if (opts.useFlash) {
				var url = opts.url;

				if (/get/i.test(opts.type)) {
					url += (url.indexOf("?") == -1) ? "?" + opts.data : "&" + opts.data;
				}

				new Flay.Request({
					url      : url,
					method   : opts.type,
					data     : opts.data,

					success  : function (data) {
						opts.success(data);
					},
					error    : function (msg) {
						opts.error(msg);
					},
					complete : function () {
						opts.complete();
					}
				});
			} else {
				_ajax(opts);
			}
		};
	})(jQuery);
}

