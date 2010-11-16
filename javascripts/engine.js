var Engine = function(context, players) {
    this.intervalID = 0;
    this.drawingContext = context;
    this.players = players;
	this.onCollision = null;
	this.onRoundOver = null;
	this.lastHit = null;
	this.countWins = false;
	this.playerRank;
};

Engine.prototype.start = function() {
    var that = this;
	
	this.playerRank = [];
	
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
				
				this.playerRank.unshift(player.ID);
				
				player.isAlive = false;
				hit = true;

				var count = 0;
				for (var j = 0; j < this.players.length; j++) {
					if (this.players[j].isAlive && this.players[j].isPlaying && !this.players[j].canceled) {
						
						count++;
						
						if (this.countWins) {
							this.players[j].wins++;
						}
					}
				}
				
				if (count < 2) this.stop();
					
				this.checkForCallback(player.ID);
				
				if (count < 2) {
					if (this.onRoundOver) {
						this.onRoundOver();
					}

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

    if (point.x > Config.canvasWidth || point.y > Config.canvasHeight || point.x < 0 || point.y < 0) {
        return true;
    }

	if (this.drawingContext.getImageData(point.x, point.y, 1, 1).data[3] > Config.threshold) {
		return true;
	}
	
	return false;
};

Engine.prototype.checkForCallback = function(ID) {
	
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
Engine.prototype.setCollisionCallback = function(callback) {
	this.onCollision = callback;
};

Engine.prototype.setRoundCallback = function(callback) {
	this.onRoundOver = callback;
};