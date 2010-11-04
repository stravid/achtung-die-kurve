/* http://github.com/stravid/achtung-die-kurve.git
 * Player A: Arrow Keys
 * Player B: Á, S
 */


// ---- Game Init ---- //

// Creates the Game Canvas (canvasID, width, height, fullscreen)
var game = new Game('gameCanvas', 600, 400, false);

// Set a callback method whenever a hit happens
game.setCollisionCallback(function (playerID) {
	
	if (game.playerManager.numberOfPlayersAlive() < 2) {
		game.restart();
	}
});


// ---- Player Details ---- //
// game.playerManager.getPlayerColor(playerID);
// game.playerManager.getPlayerName(playerID);
// game.playerManager.getPlayerDistance(playerID);

// ---- Game Controlling Methods ----//
function onAddPlayer(name) {
	return game.addPlayer(name);	
}

function onRestartGame() {
	game.restart();
}

function onStopGame() {
	game.stop();	
}

var gameId = false;
var server;
var players = [];

function init() {
	serverWebsocket();
}

function serverWebsocket() {
	server = new WebSocket("ws://localhost:10000/game");
	server.onopen = function(evt) { 
		console.log("requesting game id");
	}
	
	server.onclose = function(evt) { console.log("game DISCONNECTED"); };

	server.onmessage = function(evt) { 
		var message = evt.data;
		// save game id on first message
		if(!gameId) { 
			gameId = message;
			console.log('game id: ' + message);
		}	else {
			
			// test on connection expression
			var connectPlayer = message.match(/(\d*) connected (\w*)/);
			if(connectPlayer) {
				players[connectPlayer[1]] = game.addPlayer(connectPlayer[2]);
				// start game when the first client connected
				if(players.length == 2) {
					// start the game
					game.restart();
				}
			}
			
			// test on accelerometer messages from iphone
			var iphoneAccel = message.match(/(\d*) ACCEL\/(.*\d\.\d*)\/(.*\d\.\d*)\/(.*\d\.\d*)/);
			if(iphoneAccel) {
				playerId = iphoneAccel[1];
				x = iphoneAccel[2];
				y = iphoneAccel[3];
				z = iphoneAccel[4];
				game.handleControl(players[playerId], y*4);
			}
			
			// test on web client gamer with left and right buttons
			var webClient = message.match(/(\d*) dir (.*\d)/);
			if(webClient) {
				playerId = webClient[1];
				var dir = webClient[2];
				game.handleControl(players[playerId], dir);
			}
		}
	};
	server.onerror = function(evt) { 
		console.error(evt.data); 
	}
};

window.addEventListener("load", init, false);