import * as https from 'https';
import * as fs from 'fs';
import * as websocket from 'websocket';

export class WS {
	private httpserver;

	public constructor(keypath:string, certpath:string) {
		var option = {
			key: fs.readFileSync(keypath),
			cert: fs.readFileSync(certpath)
		};

		this.httpserver = https.createServer(option, function (req, res) {
			res.writeHead(404);
			res.end();
		});
	}

	public run() {
		var me = this;

		this.httpserver.listen(2910, function () {
			console.log('Websocket server / OK  / ' + 2910);
		});

		var wsServer = new websocket.server({
			httpServer: me.httpserver,
			autoAcceptConnections: false
		});

		function originIsAllowed(origin:string) {
			// put logic here to detect whether the specified origin is allowed.
			return true;
		}

		wsServer.on('request', function (request) {
			if (!originIsAllowed(request.origin)) {
				// Make sure we only accept requests from an allowed origin
				request.reject();
				console.log((new Date()) + 'Connection from origin ' + request.origin + ' rejected.');
				return;
			}
			console.log('new coming');
			var connection = request.accept('proto', request.origin);
			connection.on('message', function (message) {
				console.log('received: ' + message);
			});

			connection.on('close', function (reasonCode, description) {
				console.log('closed');
			});
		});
	}
}

new WS('./key.pem', './cert.cert').run();
