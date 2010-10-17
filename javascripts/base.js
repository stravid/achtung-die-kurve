/* 
 * Player A: Arrow Keys
 * Player B: Á, S
 */

var game = new Game('gameCanvas', 1650, 900, false),
    playerA = game.addPlayer('mathi'),
    playerB = game.addPlayer('dave'),
    keyChecker = function() {
        
    },
    directionA = 0,
    directionB = 0;

game.setCollisionCallback(function (playerID) {
	
	if (game.playerManager.numberOfPlayersAlive() < 2) {
		game.restart()
	}
});

function onAddPlayer() {
	for (var i = 0; i < 50; i++) 
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

