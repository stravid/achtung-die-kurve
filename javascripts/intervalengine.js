var IntervalEngine = function(scope) {
	this.scope = scope;
	this.closure;
	this.intervalID;
	this.framesPerSecond;
	this.timestamp;
	this.isClosureSet = false;
};

IntervalEngine.prototype.setInterval = function(framesPerSecond) {
	this.framesPerSecond = framesPerSecond;
	this.timestamp = new Date().getTime();
	
	var that = this;
	this.intervalID = setInterval(function() {
		
		if (that.isClosureSet) {
			
			var newTimestamp = new Date().getTime();
			var difference = newTimestamp - that.timestamp;
			
			that.timestamp = newTimestamp;
			
			that.closure.call(that.scope, difference / (1000 / that.framesPerSecond));	
		}
	}, 1000 / framesPerSecond);
};

IntervalEngine.prototype.clearInterval = function() {
	clearInterval(this.intervalID);
};

IntervalEngine.prototype.setCallback = function(closure) {
	this.isClosureSet = true;
	this.closure = closure;
};