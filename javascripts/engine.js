var Engine = function(width, height, context, players) {
    this.frameRate = 100;
    this.intervalID = 0;
    this.drawingContext = context;
    this.players = players;
	
	// FIXME: should be a Game var not in engine!
	this.lineWidth = 3;
	this.onCollision = null;
	this.lastHit = null;
    this.width = width;
    this.height = height;
};

Engine.prototype.start = function() {
    var that = this;
	
	this.cancel = false;
	
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

		if (!player.isPlaying || !player.isAlive) {
			continue;
		}
		
        deltaX = Math.cos(player.angle * Math.PI / 180) * player.speed;
        deltaY = Math.sin(player.angle * Math.PI / 180) * player.speed;
		
		if (this.hitTest({x: player.x + deltaX, y: player.y + deltaY})) {
			player.isAlive = false;
			hit = true;
			
			var count = 0;
			for (var j = 0; j < this.players.length; j++) {
				if (this.players[j].isAlive) {
					count++;
				}
			}
			
			this.checkForCallback(player.ID);
			
			if (count < 2) {
				return;
			}
			
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
		player.distance += Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    } 
	
	if (!hit) {
        this.lastHit = null;
    }
};

Engine.prototype.hitTest = function(point) {
	
    // FIXME: no magic numbers 
	if (this.drawingContext.getImageData(point.x, point.y, 1, 1).data[3] > 100) {
		return true;
	}
	
	return false;
}

Engine.prototype.checkForCallback = function (ID) {
	
	// FIXME: It's still triggering more than one callback sometimes.
	
	if (!this.onCollision) {
        return;
    }
	
	if (this.lastHit == null || this.lastHit != ID) {
        this.onCollision(ID);
    }
	
	this.lastHit = ID;
}

/* ---- Getter & Setter ---- */
Engine.prototype.setCollisionCallback = function (callback) {
	this.onCollision = callback;
}