var PlayerManager = function() {
    this.players = [];
    this.colorManager = new ColorManager(Config.colorSaturation, Config.colorValue);
};

PlayerManager.prototype.addPlayer = function(name) {
    var newPlayer = new Player();
    
    newPlayer.name = name;
    newPlayer.color = this.getColor();
	
    newPlayer.ID = this.players.length;

    return this.playerPush(newPlayer);
};

PlayerManager.prototype.playerPush = function (newPlayer) {
	for (var i=0; i < this.players.length; i++) {
		var player = this.players[i];
		
		if (player.canceled) {
			this.players[i] = newPlayer;
			return i;
		}
	}
	
	this.players.push(newPlayer);
	
	return this.players.length - 1;
};

PlayerManager.prototype.removePlayer = function(playerID) {
	this.getPlayerByID(playerID).canceled = true;
};

PlayerManager.prototype.initializePlayers = function() {
    for (var i = 0; i < this.players.length; i++) {
        var player = this.players[i];

        player.x = Utilities.random(Config.canvasWidth / 4, 3 * Config.canvasWidth / 4);
        player.y = Utilities.random(Config.canvasHeight / 4, 3 * Config.canvasHeight / 4);
        player.angle = Math.random() * 360;	
        player.isPlaying = true;
        player.isAlive = true;
		player.resetTimeout();
    }
};

PlayerManager.prototype.getColor = function() {
    return this.colorManager.convertRGBToHex(this.colorManager.getColor());
};

PlayerManager.prototype.navigatePlayer = function(playerID, direction) {
    var player = this.getPlayerByID(playerID);

    player.navigate(direction);
};

PlayerManager.prototype.numberOfPlayersAlive = function() {
    var count = 0;

    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].isAlive && !this.players[i].canceled) {
            count++;
        }
    }

    return count;
};

PlayerManager.prototype.numberOfPlayers = function() {
    var count = 0;

    for (var i = 0; i < this.players.length; i++) {
        if (!this.players[i].canceled) {
            count++;
        }
    }

    return count;
};

PlayerManager.prototype.resetScores = function() {
	for (var i = 0; i < this.players.length; i++) {
		this.players[i].wins = 0;
		this.players[i].distane = 0;
	}
};

/* ---- GETTER & SETTER ---- */
PlayerManager.prototype.getPlayerByID = function(playerID) {
    return this.players[playerID]; 
};

PlayerManager.prototype.getPlayerName = function(playerID) {
    return this.players[playerID].name;
};

PlayerManager.prototype.getPlayerDistance = function(playerID) {
    return this.players[playerID].distance;
};

PlayerManager.prototype.getPlayerColor = function(playerID) {
    return this.players[playerID].color;
};

PlayerManager.prototype.getPlayerWins = function(playerID) {
    return this.players[playerID].wins;
};

PlayerManager.prototype.getAlivePlayers = function() {
	var alivePlayers = [];
	
	for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].isAlive && !this.players[i].canceled) {
            alivePlayers.push(this.players[i].ID);
        }
    }
	
	return alivePlayers;
};