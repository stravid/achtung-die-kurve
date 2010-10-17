/* 
 * Player A: Arrow Keys
 * Player B: Á, S
 */

var game = new Game('gameCanvas', 1200, 700, false),
    playerA = game.addPlayer('mathi'),
    playerB = game.addPlayer('dave'),
    keyChecker = function() {
        
    },
    directionA = 0,
    directionB = 0;

game.setCollisionCallback(function (playerID) {
	
	//console.log(game.playerManager.getPlayerName(playerID) + " failed!");
	
	//console.log("Mathi went " + game.playerManager.getPlayerDistance(playerA) + " pixels!");
	//console.log("Dave went " + game.playerManager.getPlayerDistance(playerB) + " pixels!");
	
	if (game.playerManager.numberOfPlayersAlive() < 2) {
		game.restart()
	}
});

function onAddPlayer() {
	game.addPlayer('bla');	
}

game.start();
  
setInterval(function() {
    game.handleControl(playerA, directionA);
    game.handleControl(playerB, directionB);
}, 10);


window.onkeydown = function(event) {
    switch (event.keyCode) {
        case 37:
            directionA = -1;
            break;
        case 39:
            directionA = 1;
            break;
        case 65:
            directionB = -1;
            break;
        case 83:
            directionB = 1;
            break;
    }
};

window.onkeyup = function(event) {
    switch (event.keyCode) {
        case 37:
            directionA = 0;
            break;
        case 39:
            directionA = 0;
            break;
        case 65:
            directionB = 0;
            break;
        case 83:
            directionB = 0;
            break;
    }
};

