(function() {
    var canvasID = 'canvas',
        domLeftColumn = document.getElementById('leftColumn'),
        domRightColumn = document.getElementById('rightColumn'),
        domHelpContainer = document.getElementById('helpContainer'),
        domCanvas = document.getElementById(canvasID),
        domAddPlayerButton = document.getElementById('addPlayerButton'),
        domAddPlayerContainer = document.getElementById('addPlayerContainer'),
        domPlayerNameInput = document.getElementById('playerNameInput'),
        domPlayerControlsSelect = document.getElementById('playerControlsSelect'),
        domPlayerListContainer = document.getElementById('playerListContainer'),
        domPlayerList = document.getElementById('playerList'),
        domStartGameButton = document.getElementById('startGame'),
        domStartGameContainer = document.getElementById('startGameContainer'),
        minimalPlayerNameLength = 2,
        keysInUse = {},
        currentDirections = {},
        temporaryString,
        numberOfUnusedControls,
        temporarySortItem,
        i,
        j,
        player,
        players = [],
        listOfControls = [
            {
                label: 'Left / Right',
                leftKeyCode: 37,
                rightKeyCode: 39,
                inUse: false
            },
            {
                label: 'A / S',
                leftKeyCode: 65,
                rightKeyCode: 83,
                inUse: false
            }
        ],
        game = new Game(canvasID, domLeftColumn.clientWidth, domLeftColumn.clientHeight, false),
        setCurrentDirection = function(playerID, direction) {
            currentDirections[playerID] = direction;   
        },
        handleKeyUp = function(event) {
            if (keysInUse[event.keyCode]) {
                setCurrentDirection(keysInUse[event.keyCode].playerID, keysInUse[event.keyCode].direction);
            }
        },
        handleKeyDown = function(event) {
            if (keysInUse[event.keyCode]) {
                setCurrentDirection(keysInUse[event.keyCode].playerID, 0);
            }
        },
        handleAddPlayerClick = function() {
            if (domPlayerNameInput.value.length > minimalPlayerNameLength) {
                addPlayer(domPlayerNameInput.value, domPlayerControlsSelect.value);

                domPlayerNameInput.value = '';
            }
        },
        handleStartGameClick = function() {
            domCanvas.className = 'show';
            domStartGameContainer.className = 'hide';
            domHelpContainer.className = 'hide';


            game.start();
            game.restart();
        },
        addPlayer = function(name, controlID) {
            player = {};

            player.ID = game.addPlayer(name);
            player.name = name;
            player.color = game.playerManager.getPlayerColor(player.ID);
            player.controlID = controlID;
            player.points = 0;

            players.push(player);

            activateControls(player.ID, controlID);
            writePlayerControls();

            updatePlayerList();
            checkPlayerLimit();

            if (players.length > 1) {
                domStartGameContainer.className = 'show';
            }
        },
        sort = function(array, key) {
            for (i = 0; i < array.length; i++) {
                for (j = 0; j < array.length; j++) {
                    if (array[i][key] > array[j][key]) {
                        console.log("%o > %o", array[i][key], array[j][key]);
                        console.log("a: %o, b: %o", array[i], array[j]);
                        temporarySortItem = array[i];
                        array[i] = array[j];
                        array[j] = temporarySortItem;
                    }
                }
            }  
        },
        updatePlayerList = function() {
            if (players.length) {
                domPlayerListContainer.className = 'show';

                sort(players, 'points');

                temporaryString = '';

                for (var i = 0; i < players.length; i++) {
                    temporaryString += '<li style="color:' + players[i].color + ';"> ' + players[i].name + ' - ' + players[i].points + '  points</li>';
                }

                domPlayerList.innerHTML = temporaryString;
            } else {
                domPlayerListContainer.className = 'hide';
            }
        },
        checkPlayerLimit = function() {
            if (getNumberOfUnusedControls()) {
                domAddPlayerContainer.className = 'show';
            } else {
                domAddPlayerContainer.className = 'hide';
            }
        },
        getNumberOfUnusedControls = function() {
            numberOfUnusedControls = 0;

            for (i = 0; i < listOfControls.length; i++) {
                if (!listOfControls[i].inUse) {
                    numberOfUnusedControls++;
                }
            }

            return numberOfUnusedControls;
        },
        activateControls = function(playerID, controlID) {
            keysInUse[listOfControls[controlID].leftKeyCode] = {
                playerID: playerID,
                direction: -1
            };

            keysInUse[listOfControls[controlID].rightKeyCode] = {
                playerID: playerID,
                direction: 1
            };

            listOfControls[controlID].inUse = true;
        },
        writePlayerControls = function() {
            temporaryString = '';

            for (i = 0; i < listOfControls.length; i++) {
                if (!listOfControls[i].inUse) {
                    temporaryString += '<option id="control-' + i + '" value="' + i + '">' + listOfControls[i].label + '</option>';   
                }
            }

            domPlayerControlsSelect.innerHTML = temporaryString;
        };

    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;  
    
    domAddPlayerButton.onclick = handleAddPlayerClick;
    domStartGameButton.onclick = handleStartGameClick;

    game.setCollisionCallback(function (playerID) {
        
        console.log(playerID);

        if (game.playerManager.numberOfPlayersAlive() < 2) {
            game.restart();
        }
    });
    
    writePlayerControls();
})();
/*
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
    game = new Game(canvasID, document.getElementById('canvasContainer').clientWidth, document.getElementById('canvasContainer').clientHeight, false),
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
});*/