var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8888 });

var users={}

wss.on('connection', function (connection) {
	console.log("User connected");
	connection.on('message', function (message) {
		var data;
		try {
			data = JSON.parse(message);
		} catch (e) {
			console.log("Error parsing JSON");
			data = {};
		}
		switch (data.type) {
			case "login":
				console.log("User logged in as", data.name);
				if (users[data.name]) {
					sendTo(connection, {
						type: "login",
						success: false
					});
				} else {
					users[data.name] = connection;
					connection.name = data.name;
					sendTo(connection, {
						type: "login",
						success: true
					});
				}
				break;
			case "offer":
				console.log("Sending offer to", data.name);
				var conn = users[data.name];
				if (conn != null) {
					connection.otherName = data.name;
					sendTo(conn, {
						type: "offer",
						offer: data.offer,
						name: connection.name
					});
				}
				break;
			default:
				sendTo(connection, {
					type: "error",
					message: "Unrecognized command: " + data.type
				});
				break;
		}
	});
	connection.send('Hello World');
});

function sendTo(conn, message) {
	conn.send(JSON.stringify(message));
}
