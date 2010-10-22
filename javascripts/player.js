var Player = function() {
    this.x = 200;
    this.y = 200;
    this.speed = 1;
    this.angle = 0;
    this.name = '';
    this.color = '';
    this.ID = null;
	this.distance = 0;
	this.isPlaying = false;
	this.isAlive = false;
	this.canceled = false;
};

Player.prototype.navigate = function(direction) {
    var maximumChangeOfAngle = 2;

    this.angle = this.angle + maximumChangeOfAngle * direction;

    this.angle %= 360;

    if (this.angle < 0) {
        this.angle += 360;
    }
};