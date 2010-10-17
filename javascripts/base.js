/* 
 * Player A: Arrow Keys
 * Player B: Á, S
 */

var game = new Game('gameCanvas', 600, 400, true),
    playerA = game.addPlayer('mathi'),
    playerB = game.addPlayer('dave'),
    keyChecker = function() {
        
    },
    directionA = 0,
    directionB = 0;

game.setCollisionCallback(function (playerID) {
	console.log(game.playerManager.getPlayerName(playerID) + " failed!");
	
	/*
	 * The engine is capable of counting the distance (in pixels) how far every
	 * player went. However - until now - it's a little senseless as you can see when
	 * you play one round. The game stops whenever somebody hits the frame but that also means
	 * every player went the exact same distance!
	 * Still it's a 'nice to have'!
	 */
	
	console.log("Mathi went " + game.playerManager.getPlayerDistance(playerA) + " pixels!");
	console.log("Dave went " + game.playerManager.getPlayerDistance(playerB) + " pixels!");
	
	game.engine.stop();
});
  
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

