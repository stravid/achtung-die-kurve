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
        numberOfDirectionProcessesPerSecond = 100,
        processCurrentDirectionsIntervalID,
        endscreenPlayers = [],
        killList = [],
        scoreList = [],
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
            },
            {
                label: 'G / H',
                leftKeyCode: 71,
                rightKeyCode: 72,
                inUse: false
            },
            {
                label: 'K / L',
                leftKeyCode: 75,
                rightKeyCode: 76,
                inUse: false
            }
        ],
        game = new Game(canvasID, domLeftColumn.clientWidth, domLeftColumn.clientHeight, false),
        drawingContext = game.getDrawingContext(),
        setCurrentDirection = function(playerID, direction) {
            currentDirections[playerID] = direction;   
        },
        handleKeyUp = function(event) {
            if (keysInUse[event.keyCode]) {
                setCurrentDirection(keysInUse[event.keyCode].playerID, 0);
            }
        },
        handleKeyDown = function(event) {
            if (keysInUse[event.keyCode]) {
                setCurrentDirection(keysInUse[event.keyCode].playerID, keysInUse[event.keyCode].direction);
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
            //game.restart();
            game.startSession();
            startCurrentDirectionsProcess();
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
                        temporarySortItem = array[i];
                        array[i] = array[j];
                        array[j] = temporarySortItem;
                    }
                }
            }  
        },
        handleCollision = function(playerID) {
            killList.unshift(playerID);

            if (game.playerManager.numberOfPlayersAlive() < 2) {
                game.stop();

                setTimeout(function() {
                    game.restart();
                }, 3000);

                for (var i = 0; i < players.length; i++) {
                    players[i].points = game.playerManager.getPlayerWins(players[i].ID);
                }

                updatePlayerList();

                for (var i = 0; i < players.length; i++) {
                    var isIncluded = false;

                    for (var j = 0; j < killList.length; j++) {
                        if (players[i].ID == killList[j]) {
                            isIncluded = true;
                            break;
                        }
                    }

                    if (!isIncluded) {
                        killList.unshift(players[i].ID);
                        break;
                    }
                }

                drawEndScreen();

                killList = [];
            } 
        },
        drawEndScreen = function() {
            drawingContext.font = "50px Georgia serif";
            drawingContext.textAlign = 'center';
            var start = (domLeftColumn.clientHeight / 2) - (50 * players.length) / 2

            for (var i = 0; i < killList.length; i++) {
                drawingContext.fillStyle = players[killList[i]].color;
                drawingContext.fillText(i + 1 + '. ' + players[killList[i]].name, domLeftColumn.clientWidth / 2, start + i * 50);
            }
        },
        updatePlayerList = function() {
            if (players.length) {
                domPlayerListContainer.className = 'show';

                for (var i = 0; i < players.length; i++) {
                    scoreList[i] = players[i];
                }

                sort(scoreList, 'points');

                temporaryString = '';

                for (var i = 0; i < scoreList.length; i++) {
                    temporaryString += '<li style="color:' + scoreList[i].color + ';"> ' + scoreList[i].name + ' - ' + scoreList[i].points + '  points</li>';
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
        },
        processCurrentDirections = function() {
            for (i in currentDirections) {
                game.handleControl(i, currentDirections[i]);
            }
        },
        startCurrentDirectionsProcess = function() {
            processCurrentDirectionsIntervalID = setInterval(processCurrentDirections, 1000 / numberOfDirectionProcessesPerSecond);
        };

    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;  
    
    domAddPlayerButton.onclick = handleAddPlayerClick;
    domStartGameButton.onclick = handleStartGameClick;

    game.setCollisionCallback(handleCollision);
    
    writePlayerControls();
})();