var Engine = function(context, players) {
    this.frameRate = 100;
    this.intervalID = 0;
    this.drawingContext = context;
    this.players = players;
	
	// FIXME: should be a Game var not in engine!
	this.lineWidth = 3;
	this.onCollision = null;
	this.lastHit = null;
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
        deltaY,
		hit = false;

    for (var i = 0; i < this.players.length; i++) {
        player = this.players[i];
        deltaX = Math.cos(player.angle * Math.PI / 180) * player.speed;
        deltaY = Math.sin(player.angle * Math.PI / 180) * player.speed;
		
		if (this.hitTest({x: player.x + deltaX, y: player.y + deltaY})) {
			this.checkForCallback(player.ID, player.name);
			hit = true;
		} 
		
        this.drawingContext.strokeStyle = player.color;
        this.drawingContext.fillStyle = player.color;
        this.drawingContext.beginPath();
        this.drawingContext.lineWidth = this.lineWidth;
        this.drawingContext.moveTo(player.x, player.y);
        this.drawingContext.lineTo(player.x + deltaX, player.y + deltaY);
        this.drawingContext.stroke();

        player.x += deltaX;
        player.y += deltaY;
    } 
	
	if (!hit) {
        this.lastHit = null;
    }
};

Engine.prototype.hitTest = function(point) {
	
	/* 
	 * For collision detection the 0 alpha background of the canvas itsef is
	 * being compared with the pixel the player is heading to
	 *
	 * I'm only using one single pixel because any bigger area (especially circles) are
	 * to big an are always reaching into the already drawn snake
	 */
	

    // FIXME: no magic numbers 
	if (this.drawingContext.getImageData(point.x, point.y, 1, 1).data[3] > 50) {
		return true;
	}
	
	return false;
}

Engine.prototype.checkForCallback = function (ID, name) {
	
	// FIXME: It's still triggering more than one callback sometimes.
	
	if (!this.onCollision) {
        return;
    }
	
	if (this.lastHit == null || this.lastHit != ID) {
        this.onCollision(name);
    }
	
	this.lastHit = ID;
}

/* ---- Getter & Setter ---- */
Engine.prototype.setCollisionCallback = function (callback) {
	this.onCollision = callback;
}