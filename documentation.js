/*
* ========================================
* This is a short paragraph on how to implement "Achtung die Kurve" on your own pace.
* ========================================
*
*
* Creates a new game.
*
* Parameter: canvasID : string
*            canvasWidth : int
*            canvasHeight : int
*            useFullscreen : boolean
*/
var game = new Game("myCanvas", 500, 700, false);

/*
* Create a new Player.
*
* Parameter: name : string
*
* Returns: Player id (int)
*/
var myPlayerID = game.addPlayer("Mathias");

/*
* Removes a Player from the current game. The player will be left out, when the next round starts.
*
* Parameter: playerID : int
*/
game.removePlayer(myPlayerID);

/*
* Sets a callback to be triggered everytime a player dies.
*
* Parameter: callback : funtion
*/
game.setCollisionCallback(function (deadPlayer) {
    console.log ("Player with ID %i just died.");
});

/*
* Starts the game. With this action it imediatly starts drawing the lines.
*/
game.start();

/*
* Restarts the game at any point. This method doesn't drop the score that has been
* set till now
*/
game.restart();

/*
* Stops the game. Only stops drawing. Doesn't reset scores.
*/
game.stop();


/* 
* ========================================
* There is a easy way to keep track of all the scores over several rounds without
* managing ever hit over the collision callback
* ========================================
*/

/*
* Starts a mechanism that tracks the scroe of each player over multiple games
* until you force the mechanism to stop.
*/
game.startSession();

/*
* Stops the counting of scroes for each player. Doesn't reset scores.
*/
game.stopSession();

/*
* Sets a callback after every round containing a few stats. Including the winner
* of the current game and the ranking of the current game. 
*/
game.setRoundCallback(function(stats) {
    console.log("the winnerID is %i ", stats.winnerID);
    console.log("Ranks: %o", stats.rank); // prints an array including the IDs of the player
});


/* 
* ========================================
* There are a few accessors for info on each player. Playerinfo is always accessed over the 
* playerID. All players are managed and controlled over the playermanager.
* ========================================
*/

/*
* Sets a callback after every round containing a few stats. Including the winner
* of the current game and the ranking of the current game. 
*/

/*
* Returns the color of a player.
*
* Parameter: playerID : int
*
* Returns: color (string)
*/
game.playerManager.getPlayerColor(myPlayerID);

/*
* Returns the Distance the player has moved since the session started.
*
* Parameter: playerID : int
*
* Returns: distance (int)
*/
game.playerManager.getPlayerDistance(myPlayerID);

/*
* Returns the name of the player.
*
* Parameter: playerID : int
*
* Returns: name (string)
*/
game.playerManager.getPlayerName(myPlayerID);

/*
* Returns the number of the wins during the current session.
*
* Parameter: playerID : int
*
* Returns: wins (int)
*/
game.playerManager.getPlayerWins(myPlayerID);