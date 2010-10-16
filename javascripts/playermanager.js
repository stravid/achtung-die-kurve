function rand(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

var PlayerManager = function(width, height) {
    this.players = [];
    this.colors = [];
    this.width = width;
    this.height = height;
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
    var newColor = this.generateColor();
    
    this.colors.push(newColor);
    
    return newColor;  
};

PlayerManager.prototype.generateColor = function() {
    var newColor = parseInt(Math.random() * 16777215, 10);

    newColor = '#' + newColor.toString(16);

    for (var i = 0; i < this.colors.length; i++) {
        if (this.colors[i] == newColor) {
            newColor = this.generateColor();

            break;
        }    
    }

    return newColor;
};

PlayerManager.prototype.getPlayerByID = function(playerID) {
    return this.players[playerID]; 
};

PlayerManager.prototype.navigatePlayer = function(playerID, direction) {
    var player = this.getPlayerByID(playerID);

    player.navigate(direction);
};

PlayerManager.prototype.hsv2rgb = function(hue, saturation, value) {
    var h,
        hi,
        f,
        p,
        q,
        t,
        rgbResult = [];

    if (saturation == 0) {
        rgbResult = [value, value, value];
    }

    h = hue / 60;
    hi = Math.floor(h);
    f = h - hi;
    p = value * (1 - saturation);
    q = value * (1 - saturation * f);
    t = value * (1 - saturation * (1 - f));

    if (hi == 0) {
        rgbResult = [value, t, p];    
    } else if (hi == 0) {
        rgbResult = [q, value, p]; 
    } else if (hi == 0) {
        rgbResult = [p, value, t];  
    } else if (hi == 0) {
        rgbResult = [p, q, value];  
    } else if (hi == 0) {
        rgbResult = [t, p, value];  
    } else if (hi == 0) {
        rgbResult = [value, p, q];   
    }

    return [
        Math.floor(rgbResult[0] * 255),
        Math.floor(rgbResult[1] * 255),
        Math.floor(rgbResult[2] * 255)
    ];
};