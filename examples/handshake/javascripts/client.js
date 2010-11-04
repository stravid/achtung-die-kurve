function setupClient() {

	var clientId = false;
	var server = document.getElementById("server").value;
	var gameId = document.getElementById("game").value;
	var name = document.getElementById("name").value;
	
	client = new WebSocket("ws://" + server + ":10000/" + gameId + "/connect/" + name);
	client.onopen = function(evt) { 
		console.log("requesting game id");
	}
	
	client.onclose = function(evt) { console.log("game DISCONNECTED"); };

	client.onmessage = function(evt) { 
		var message = evt.data;
		// save game id on first message
		if(!clientId) { 
			clientId = message;
			console.log('player id: ' + message);
			
			client.setupControlListener();
		}
	};
	
	client.onerror = function(evt) { 
		console.error(evt.data); 
	}
	
	client.handleKeyUp = function(event) {
	    if (event.keyCode == 37 || event.keyCode == 39) {
	        client.setDirection(0);
	    }
	}
	client.handleKeyDown = function(event) {
			// handle left key
	    if (event.keyCode == 37) {
					client.setDirection(-1);
			}
			// handle right key
			if (event.keyCode == 39) {
        	client.setDirection(1);
			}
	}

	client.setupControlListener = function() {
		window.onkeydown = client.handleKeyDown;
		window.onkeyup = client.handleKeyUp;
	}
	
	client.setDirection = function(dir) {
		console.log("direction " + dir);
		client.send("game dir " + dir);
	}
};