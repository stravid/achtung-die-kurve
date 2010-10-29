var Engine = function(context, players) {
    this.intervalID = 0;
    this.drawingContext = context;
    this.players = players;
	this.onCollision = null;
	this.lastHit = null;
	this.countWins = false;
};

Engine.prototype.start = function() {
    var that = this;
	
    if (this.intervalID === 0) {
        this.intervalID = setInterval(function() {
            that.draw();
        }, 1000 / Config.frameRate);    
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

		if (!player.isPlaying || !player.isAlive || player.canceled) {
			continue;
		}
		
		var speed = Config.pixelsPerSecond * (1000 / Config.frameRate / 1000);
		
        deltaX = Math.cos(player.angle * Math.PI / 180) * speed;
        deltaY = Math.sin(player.angle * Math.PI / 180) * speed;
		
		if (player.hole === 0) { 
		
			if (this.hitTest({x: player.x + deltaX, y: player.y + deltaY})) {
				player.isAlive = false;
				hit = true;
				
				var count = 0;
				for (var j = 0; j < this.players.length; j++) {
					if (this.players[j].isAlive) {
						count++;
					}
				}
				
				
				if (this.countWins) {
						
					for (var k = 0; k < this.players.length; k++) {
						
						if (this.players[k].isAlive && this.players[k].isPlaying && !this.players[k].canceled ) {
							this.players[k].wins++;
						}
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
			this.drawingContext.lineWidth = Config.lineWidth;
			this.drawingContext.moveTo(player.x, player.y);
			this.drawingContext.lineTo(player.x + deltaX, player.y + deltaY);
			this.drawingContext.stroke();
			
		} else {
			
			player.hole--;	
			
			if (player.hole === 0) {
				player.calculateNextHole();
			}
		}
		
        player.x += deltaX;
        player.y += deltaY;
		player.distance += Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    } 
	
	if (!hit) {
        this.lastHit = null;
    }
};

Engine.prototype.hitTest = function(point) {
	
	// FIXME: Sometimes unexpected hits.
	
	if (this.drawingContext.getImageData(point.x, point.y, 1, 1).data[3] > Config.threshold) {
		return true;
	}
	
	return false;
};

Engine.prototype.checkForCallback = function (ID) {
	
	// FIXME: It's still triggering more than one callback sometimes.
	
	if (!this.onCollision) {
        return;
    }
	
	if (this.lastHit === null || this.lastHit != ID) {
        this.onCollision(ID);
    }
	
	this.lastHit = ID;
};

/* ---- Getter & Setter ---- */
Engine.prototype.setCollisionCallback = function (callback) {
	this.onCollision = callback;
};