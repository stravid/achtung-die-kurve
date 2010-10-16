var game = new Game('gameCanvas', 600, 400, true),
    playerA = game.addPlayer('rufus'),
    playerB = game.addPlayer('fränk'),
    keyChecker = function() {
        
    },
    directionA = 0,
    directionB = 0;
    
setInterval(function() {
    game.handleControl(playerA, directionA);
    game.handleControl(playerB, directionB);
}, 10);


window.onkeydown = function(event) {
    console.log(event.keyCode);
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

/*var gCanvasElement,
    gDrawingContext,
    draw,
    Player,
    playerA,
    deltaX,
    deltaY,
    stop = false;

gCanvasElement = document.getElementById('gameCanvas');
gCanvasElement.width = 500;
gCanvasElement.height = 500;  
    
if (gCanvasElement.getContext) {
    gDrawingContext = gCanvasElement.getContext('2d');
} else {
    throw 'No canvas support';
}

gDrawingContext.fillStyle = "rgb(255, 255, 255)";
gDrawingContext.fillRect(0, 0, 500, 500);

gDrawingContext.fillStyle = "rgb(0, 0, 0)";

//gDrawingContext.fillRect(0, 0, 5, 5);

//console.log(gDrawingContext.getImageData(2, 2, 1, 1).data);



draw = function() {

    if (stop)
        return;

    if (playerA.direction == 'left') {
        if (playerA.angle - 0.8 < 0) {
            playerA.angle = 360 +playerA.angle - 0.8;
        } else {
            playerA.angle = playerA.angle - 0.8;
        }
    }

    if (playerA.direction == 'right') {
        playerA.angle = (playerA.angle + 0.8) % 360;
    }

    deltaX = Math.cos(playerA.angle * Math.PI / 180) * playerA.speed;
    deltaY = Math.sin(playerA.angle * Math.PI / 180) * playerA.speed;

    if (gDrawingContext.getImageData(playerA.x + deltaX, playerA.y + deltaY, 1, 1).data[0] < 100) {
        console.log(gDrawingContext.getImageData(playerA.x + deltaX, playerA.y + deltaY, 1, 1).data);
    }

    gDrawingContext.beginPath();
    gDrawingContext.lineWidth = 5;
    gDrawingContext.moveTo(playerA.x, playerA.y);
    gDrawingContext.lineTo(playerA.x + deltaX, playerA.y + deltaY);
    gDrawingContext.stroke();

    playerA.x += deltaX;
    playerA.y += deltaY;
};

Player = function() {
    this.angle = 45; 
    this.x = 200;
    this.y = 200;
    this.speed = 1;
};

Player.prototype.setDirection = function(direction) {
    this.direction = direction;  
};

playerA = new Player();

window.onkeydown = function(event) {
    switch (event.keyCode) {
        case 37:
            playerA.setDirection('left');
            break;
        case 39:
            playerA.setDirection('right');
            break;
        case 38:
            stop = true;
            break;
    }
};

window.onkeyup = function(event) {
    switch (event.keyCode) {
        case 37:
            playerA.setDirection('none');
            break;
        case 39:
            playerA.setDirection('none');
            break;
    }
};

setInterval(draw, 10);*/