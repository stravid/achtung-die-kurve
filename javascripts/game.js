var Game = function(canvasID, canvasWidth, canvasHeight /*, useFullscreen */) {
    if (arguments[3]) {
        this.useFullscreen = arguments[3];
    }

    var width = canvasWidth,
        height = canvasHeight,
        canvasElement = document.getElementById(canvasID),
        drawingContext;

    if (this.useFullscreen) {
        width = window.innerWidth;
        height = window.innerHeight;
    }

    canvasElement.width = width;
    canvasElement.height = height; 
    
    if (canvasElement.getContext) {
        drawingContext = canvasElement.getContext('2d');
    } else {
        throw 'No canvas support';
    }

    //drawingContext.fillStyle = 'rgb(50, 50, 50)';
    //drawingContext.fillRect(0, 0, width, height);

    this.playerManager = new PlayerManager(width, height);
    this.engine = new Engine(drawingContext, this.playerManager.players);

    this.engine.start();
};

Game.prototype.addPlayer = function(name) {
    return this.playerManager.addPlayer(name);
}

Game.prototype.handleControl = function(playerID, direction) {
    this.playerManager.navigatePlayer(playerID, direction);  
};