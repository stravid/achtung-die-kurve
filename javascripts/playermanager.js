function rand(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

var PlayerManager = function(width, height) {
    this.players = [];
    this.width = width;
    this.height = height;
    this.colorManager = new ColorManager(0.99, 0.99);
};

PlayerManager.prototype.addPlayer = function(name) {
    var newPlayer = new Player();
    
    newPlayer.name = name;
    newPlayer.color = this.getColor();
    newPlayer.ID = this.players.length;

    newPlayer.x = rand(this.width / 4, 3 * this.width / 4);
    newPlayer.y = rand(this.height / 4, 3 * this.height / 4);
    newPlayer.angle = Math.random() * 360;

    this.players.push(newPlayer);

    return newPlayer.ID;
};

PlayerManager.prototype.getColor = function() {
    return this.colorManager.convertRGBToHex(this.colorManager.getColor());
};

PlayerManager.prototype.getPlayerByID = function(playerID) {
    return this.players[playerID]; 
};

PlayerManager.prototype.getPlayerName = function (playerID) {
	return this.players[playerID].name;
}

PlayerManager.prototype.getPlayerDistance = function (playerID) {
	return this.players[playerID].distance;
}

PlayerManager.prototype.navigatePlayer = function(playerID, direction) {
    var player = this.getPlayerByID(playerID);

    player.navigate(direction);
};