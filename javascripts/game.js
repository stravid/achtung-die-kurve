var Game = function(canvasID, canvasWidth, canvasHeight /*, useFullscreen */) {
    if (arguments[3]) {
        this.useFullscreen = arguments[3];
    }

    this.width = canvasWidth;
    this.height = canvasHeight;

    var canvasElement = document.getElementById(canvasID),
        drawingContext,
        // FIXME: is it in use?
		collisionCall = function () {};

    if (this.useFullscreen) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    canvasElement.width = this.width;
    canvasElement.height = this.height; 
    
    if (canvasElement.getContext) {
        this.drawingContext = canvasElement.getContext('2d');
    } else {
        throw 'No canvas support';
    }
	
	this.createFrame();
	
    this.playerManager = new PlayerManager(this.width, this.height);
    this.engine = new Engine(this.width, this.height, this.drawingContext, this.playerManager.players);

    this.engine.start();
};

Game.prototype.addPlayer = function(name) {
    return this.playerManager.addPlayer(name);
}

Game.prototype.handleControl = function(playerID, direction) {
    this.playerManager.navigatePlayer(playerID, direction);  
};

Game.prototype.setCollisionCallback = function (callback) {
	this.engine.setCollisionCallback(callback);
}

Game.prototype.createFrame = function () {
	
	this.drawingContext.lineWidth = 3;
	this.drawingContext.strokeStyle = "#000";
	this.drawingContext.strokeRect(10, 10, this.width - 20, this.height - 20);
}