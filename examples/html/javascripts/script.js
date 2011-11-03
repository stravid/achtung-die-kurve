/*global window: false */

var Game = Game || {};

(function(Game) {
    var canvasID = 'canvas',
        domLeftColumn = document.getElementById('leftColumn'),
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
        domUpgradeContainer = document.getElementById('upgradeContainer'),
        minimalPlayerNameLength = 2,
        keysInUse = {},
        currentDirections = {},
        temporaryString,
        numberOfUnusedControls,
        temporarySortItem,
        numberOfDirectionProcessesPerSecond = 100,
        processCurrentDirectionsIntervalID,
        scoreList = [],
        roundResult = [],
        gameStarted = false,
        i,
        j,
        player,
        players = [],
        keyPressCount = 0,
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
                keyPressCount++;
            }
        },
        handleKeyDown = function(event) {
            if (keysInUse[event.keyCode]) {
                setCurrentDirection(keysInUse[event.keyCode].playerID, keysInUse[event.keyCode].direction);
            }
        },
        processCurrentDirections = function() {
            for (var playerID in currentDirections) {
                if (currentDirections.hasOwnProperty(playerID)) {
                    game.handleControl(playerID, currentDirections[playerID]);
                }
            }
        },
        startCurrentDirectionsProcess = function() {
            processCurrentDirectionsIntervalID = setInterval(processCurrentDirections, 1000 / numberOfDirectionProcessesPerSecond);
        },
        handleStartGameClick = function() {
            domCanvas.className = 'show';
            domStartGameContainer.className = 'hide';
            domHelpContainer.className = 'hide';

            gameStarted = true;

            game.start();
            game.startSession();
            startCurrentDirectionsProcess();
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
        updatePlayerList = function() {
            if (players.length) {
                domPlayerListContainer.className = 'show';

                scoreList = [];

                for (i = 0; i < players.length; i++) {
                    if (players[i].isPlaying) {
                        scoreList.push(players[i]);
                    }
                }

                sort(scoreList, 'points');

                temporaryString = '';

                for (i = 0; i < scoreList.length; i++) {
                    temporaryString += '<li id="' + scoreList[i].ID + '" style="color:' + scoreList[i].color + ';"> ' + scoreList[i].name + ' - ' + scoreList[i].points + '  points <span>Remove</span></li>';
                }

                domPlayerList.innerHTML = temporaryString;
            } else {
                domPlayerListContainer.className = 'hide';
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
        checkPlayerLimit = function() {
            if (getNumberOfUnusedControls()) {
                domAddPlayerContainer.className = 'show';
            } else {
                domAddPlayerContainer.className = 'hide';
            }
        },
        addPlayer = function(name, controlID) {
            player = {};

            player.ID = game.addPlayer(name);
            player.name = name;
            player.color = game.playerManager.getPlayerColor(player.ID);
            player.controlID = controlID;
            player.points = 0;
            player.isPlaying = true;

            players.push(player);

            activateControls(player.ID, controlID);
            writePlayerControls();

            updatePlayerList();
            checkPlayerLimit();

            if (players.length > 1 && domStartGameContainer.className == 'hide' && !gameStarted) {
                domStartGameContainer.className = 'show';
            }
        },
        handleAddPlayerClick = function() {
            if (domPlayerNameInput.value.length > minimalPlayerNameLength) {
                addPlayer(domPlayerNameInput.value, domPlayerControlsSelect.value);

                domPlayerNameInput.value = '';
            }
        },
        drawEndScreen = function() {
            drawingContext.font = "50px Georgia serif";
            drawingContext.textAlign = 'center';
            var start = (domLeftColumn.clientHeight / 2) - (50 * players.length) / 2;

            for (i = 0; i < roundResult.length; i++) {
                drawingContext.fillStyle = players[roundResult[i]].color;
                drawingContext.fillText(i + 1 + '. ' + players[roundResult[i]].name, domLeftColumn.clientWidth / 2, start + i * 50);
            }
        },      
        handleRoundEnd = function(statistics) {
            game.stop();

            saveEndscreen();

            roundResult = statistics.rank;

            for (i = 0; i < players.length; i++) {
                if (players[i].isPlaying) {
                    players[i].points = game.playerManager.getPlayerWins(players[i].ID);   
                }
            }

            updatePlayerList();
            drawEndScreen();

            setTimeout(function() {
                game.restart();
            }, 2500);
        },
        removePlayer = function(playerID) {
            playerID = parseInt(playerID, 10);

            game.removePlayer(playerID);
            var index = -1;

            for (i = 0; i < players.length; i++) {
                if (players[i].ID == playerID) {
                    index = i;
                    break;
                }
            }

            delete keysInUse[listOfControls[players[i].controlID].leftKeyCode];
            delete keysInUse[listOfControls[players[i].controlID].rightKeyCode];
            delete currentDirections[playerID];
            listOfControls[players[i].controlID].inUse = false;

            players[index].isPlaying = false;

            writePlayerControls();

            updatePlayerList();
        },
        handleRemovePlayerClick = function(event) {
            if (event.target.nodeName.toUpperCase() == 'SPAN') {
                removePlayer(event.target.parentNode.id);
            }
        }
        saveEndscreen = function() {
            if (keyPressCount < 2) return;

            var data = domCanvas.toDataURL("image/png");

            $.ajax({
                url: "./endscreens/save.php",
                type: "POST",
                data: { data: data, keyPressCount: keyPressCount },
                success: function(response) {}
            });

            keyPressCount = 0;
        };

    if (!domCanvas.getContext) {
        domUpgradeContainer.className = 'show';
        domHelpContainer.className = 'hide';
        domAddPlayerContainer.className = 'hide';
    } else {
        window.onkeydown = handleKeyDown;
        window.onkeyup = handleKeyUp;  
        
        domAddPlayerButton.onclick = handleAddPlayerClick;
        domStartGameButton.onclick = handleStartGameClick;

        domPlayerList.onclick = handleRemovePlayerClick;

        game.setRoundCallback(handleRoundEnd);
        
        writePlayerControls();
    }
})(Game);