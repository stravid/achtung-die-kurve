var PlayerManager = function() {
    this.players = [];
    this.colorManager = new ColorManager(0.99, 0.99);
};

PlayerManager.prototype.addPlayer = function(name) {
    var newPlayer = new Player();
    
    newPlayer.name = name;
    newPlayer.color = this.getColor();
    newPlayer.ID = this.players.length;

    this.players.push(newPlayer);

    return newPlayer.ID;
};

PlayerManager.prototype.initializePlayers = function() {
    for (var i = 0; i < this.players.length; i++) {
        var player = this.players[i];

        player.x = Utilities.random(Config.width / 4, 3 * Config.width / 4);
        player.y = Utilities.random(Config.height / 4, 3 * Config.height / 4);
        player.angle = Math.random() * 360;	
        player.isPlaying = true;
        player.isAlive = true;
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
        if (this.players[i].isAlive) {
            count++;
        }
    }

    return count;
};

/* ---- GETTER & SETTER ---- */
PlayerManager.prototype.getPlayerByID = function(playerID) {
    return this.players[playerID]; 
};

PlayerManager.prototype.getPlayerName = function (playerID) {
    return this.players[playerID].name;
};

PlayerManager.prototype.getPlayerDistance = function (playerID) {
    return this.players[playerID].distance;
};

PlayerManager.prototype.getPlayerColor = function (playerID) {
    return this.players[playerID].color;
};