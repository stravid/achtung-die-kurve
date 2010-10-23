var sidebarID = 'sidebarContainer',
    canvasID = 'gameCanvas',
    playerNameID = 'playerName',
    playerControlsID = 'playerControls',
    startGameID = 'startGame',
    restartGameID = 'restartGame',
    stopGameID= 'stopGame',
    addPlayerID = 'addPlayer',
    playerListID = 'playerList',
    addPlayerContainerID = 'addPlayerContainer',
    playerListContainerID = 'playerListContainer',
    gameContainerID = 'gameContainer',
    game = new Game(canvasID, 600, 400, false),
    keysInUse = {},
    directions = {},
    listOfControls = [
        {
            label: 'Left / Right',
            leftKeyCode: 37,
            rightKeyCode: 39,
        },
        {
            label: 'A / S',
            leftKeyCode: 65,
            rightKeyCode: 83,
        }
    ],
    players = [],
    startGame = function() {
        document.getElementById(restartGameID).className = 'button show';
        document.getElementById(stopGameID).className = 'button show';
        document.getElementById(startGameID).className = 'button hide';

        game.start();
    },
    resetGame = function() {
        
    },
    stopGame = function() {
        
    },
    addPlayer = function() {
        var playerName = document.getElementById(playerNameID).value;
        var player = {};
        var control = document.getElementById(playerControlsID);

        if (playerName.length > 1) {
            player.ID = game.addPlayer(playerName);
            player.name = playerName;
            player.color = game.playerManager.getPlayerColor(player.ID);
            players.push(player);

            document.getElementById(playerNameID).value = '';

            keysInUse[listOfControls[control.value].leftKeyCode] = {
                playerID: player.ID,
                direction: -1
            };

            keysInUse[listOfControls[control.value].rightKeyCode] = {
                playerID: player.ID,
                direction: 1
            };

            control.removeChild(document.getElementById('control-' + control.value));

            if (control.children.length < 1) {
                document.getElementById(addPlayerContainerID).className = 'hide';
            }

            if (players.length > 1) {
                document.getElementById(gameContainerID).className = 'show';
            }

            document.getElementById(playerListContainerID).className = 'show';

            document.getElementById(playerListID).innerHTML += '<li style="color: ' + player.color + '";>' + player.name + '</li>';
        }
    };

window.onkeydown = function(event) {
    if (keysInUse[event.keyCode]) {
        directions[keysInUse[event.keyCode].playerID] = keysInUse[event.keyCode].direction;
    }
};

window.onkeyup = function(event) {
    if (keysInUse[event.keyCode]) {
        directions[keysInUse[event.keyCode].playerID] = 0;
    }
};

var htmlList = '';
for (var i = 0; i < listOfControls.length; i++) {
    htmlList += '<option id="control-' + i + '" value="' + i + '">' + listOfControls[i].label + '</option>';
}
document.getElementById(playerControlsID).innerHTML = htmlList;

document.getElementById(startGameID).onclick = startGame;
document.getElementById(restartGameID).onclick = restartGame;
document.getElementById(stopGameID).onclick = stopGame;
document.getElementById(addPlayerID).onclick = addPlayer;

setInterval(function() {
    for (i in directions) {
        game.handleControl(i, directions[i]);
    }
}, 10);

game.setCollisionCallback(function (playerID) {
    
    if (game.playerManager.numberOfPlayersAlive() < 2) {
        game.restart();
    }
});