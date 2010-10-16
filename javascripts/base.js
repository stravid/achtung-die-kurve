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

game.setCollisionCallback(function (name) {
	console.log(name + " failed!");
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

