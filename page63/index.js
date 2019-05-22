var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8888 });

wss.on('connection', function (connection) {
	console.log("User connected");
	connection.on('message', function (message) {
		console.log("Got message:", message);
	});
	connection.send('Hello World');
});
