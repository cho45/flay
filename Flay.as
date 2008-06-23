
package {
	import flash.display.Sprite;
	import flash.events.*;
	import flash.net.URLRequest;
	import flash.net.URLLoader;
	import flash.net.URLRequestMethod;
	import flash.system.LoaderContext;
	import flash.external.ExternalInterface;

	[SWF(frameRate=1, background=0x000000)]

	public class Flay extends Sprite {
		public var callback:String;
		public var loadedcb:String;

		private var requests:Object = {};

		public function Flay () {
			callback = loaderInfo.parameters['callback'] || "Flay.Request.callback";
			loadedcb = loaderInfo.parameters['loadedcb'] || "Flay.Request.loadedcb";

			flash.system.Security.allowDomain('*');
			flash.system.Security.allowInsecureDomain('*');
			ExternalInterface.marshallExceptions = true;
			ExternalInterface.addCallback('request', request);
			ExternalInterface.call(loadedcb);
		}

		public function request (id:Number, opts:Object):void {
			var req:URLRequest   = new URLRequest(opts.url);
			var loader:URLLoader = new URLLoader();

			opts.method = opts.method ? opts.method.toUpperCase() : "GET";

			req.data   = opts.data;
			req.method = (opts.method == "POST") ? URLRequestMethod.POST : URLRequestMethod.GET;

			loader.addEventListener(Event.COMPLETE, function (e:Event):void {
				callbackToJS(id, e);
			});

			loader.addEventListener(IOErrorEvent.IO_ERROR, function (e:Event):void {
				errorbackToJS(id, IOErrorEvent.IO_ERROR);
			});

			try {
				loader.load(req);
			} catch (e:Error) {
				errorbackToJS(id, String(e));
			}
		}

		private function callbackToJS (id:int, e:Event):void {
			var loader:URLLoader = URLLoader(e.target);
			ExternalInterface.call(callback, id, {
				data: loader.data
			});
		}

		private function errorbackToJS (id:int, message:String):void {
			ExternalInterface.call(callback, id, {
				error: message
			});
		}
	}

}
