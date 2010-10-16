var Engine = function(context, players) {
    this.frameRate = 100;
    this.intervalID = 0;
    this.drawingContext = context;
    this.players = players;
};

Engine.prototype.start = function() {
    var that = this;

    if (this.intervalID == 0) {
        this.intervalID = setInterval(function() {
            that.draw();
        }, 1000 / this.frameRate);    
    }
};

Engine.prototype.stop = function() {
    clearInterval(this.intervalID);
    
    this.intervalID = 0; 
};

Engine.prototype.draw = function() {
    var player,
        deltaX,
        deltaY;

    for (var i = 0; i < this.players.length; i++) {
        player = this.players[i];
        deltaX = Math.cos(player.angle * Math.PI / 180) * player.speed;
        deltaY = Math.sin(player.angle * Math.PI / 180) * player.speed;

        /*if (gDrawingContext.getImageData(playerA.x + deltaX, playerA.y + deltaY, 1, 1).data[0] < 100) {
            console.log(gDrawingContext.getImageData(playerA.x + deltaX, playerA.y + deltaY, 1, 1).data);
        }*/

        this.drawingContext.strokeStyle = player.color;
        this.drawingContext.fillStyle = player.color;
        this.drawingContext.beginPath();
        // FIXME: no magic numbers
        this.drawingContext.lineWidth = 3;
        this.drawingContext.moveTo(player.x, player.y);
        this.drawingContext.lineTo(player.x + deltaX, player.y + deltaY);
        this.drawingContext.stroke();

        player.x += deltaX;
        player.y += deltaY;
    } 
};