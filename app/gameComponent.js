const socket = io('http://localhost:3000');

function renderGame(gameState){
	const colors = ['#ffc13d','#c77dff', '#D1383B','#238bf3','#4f772d', '#003049'];
    const gameArea = document.getElementById('gameArea');
    const colorChoice = document.getElementById('colorOptions');
    const playerArea = document.getElementById("players");

	gameArea.innerHTML = '';
	colorChoice.innerHTML = '';
	playerArea.innerHTML = '';
 
	colors.forEach(color => {
        const colorOpt = document.createElement('div');
        colorOpt.className = 'colorTiles';
        colorOpt.style.backgroundColor = color;
        colorOpt.textContent = " ";
		colorOpt.addEventListener('click', () => {
			sendMoveToServer(color);
		});

		if(!gameState.availableColors.includes(color)){
			colorOpt.style.pointerEvents = 'none';
			colorOpt.style.opacity = "0.5";
		} else {
			colorOpt.style.pointerEvents = 'auto';
			colorOpt.style.opacity = "1";
		}

        colorChoice.appendChild(colorOpt);
    });

	//* mainBoard holds numbers for captured tiles. tileBoards holds the actual colors assigned to each tile.	
	gameState.tileBoard.forEach((row, rowIndex) => {
		row.forEach((color, cellIndex) => {
			const cellElement = document.createElement('div');
			cellElement.className = 'tile';
	
			//! Tile at position (0,3) is not being set correctly.
			const mainBoardValue = gameState.mainBoard[rowIndex][cellIndex];
			if (mainBoardValue === '1') {
				cellElement.style.backgroundColor = gameState.playerColors[0]; 
			} else if (mainBoardValue === '2') {
				cellElement.style.backgroundColor = gameState.playerColors[1]; 
			} else {
				cellElement.style.backgroundColor = color;
			}
	
			cellElement.innerHTML = `<span>Tile<br>(${cellIndex}, ${rowIndex})</span>`;
			gameArea.appendChild(cellElement);
		});
	});

	let counter = 1;

	//TODO implment a mechanism that assigns the players color to the player name tile.
	for (const player in gameState.players){
		const gamePlayers = document.createElement('div');
		gamePlayers.className = 'player-names';
		gamePlayers.textContent = `Player ${counter++}`;
		gamePlayers.style.color = 'black'
		playerArea.appendChild(gamePlayers);
	}
}

//! Not doing anything >:(
function renderGameOver(winner){
	let backdrop = document.createElement('div');
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    backdrop.style.display = 'flex';
    backdrop.style.justifyContent = 'center';
    backdrop.style.alignItems = 'center';
    backdrop.style.zIndex = '1000';

    let popup = document.createElement('div');
    popup.innerHTML = `<h1>Congrats! ${winner}</h1><br><h3>Would you like to play again?</h3><br><button id="yesButton">Yes</button>&nbsp;<button id="noButton">No</button>`;
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.borderRadius = '5px';
    popup.style.textAlign = 'center';
    popup.style.color = 'black';

    backdrop.appendChild(popup);

    document.body.appendChild(backdrop);

    document.getElementById('yesButton').addEventListener('click', function() {
        window.location.reload();
    });

    document.getElementById('noButton').addEventListener('click', function() {
        document.body.removeChild(backdrop);
    });
}

function sendMoveToServer(color){
	socket.emit('move', color);
}

socket.on('connect', () => {
	console.log("Client connected to server");
});

socket.on('disconnect', () => {
	console.log('Client disconnected from server');
})

socket.on('gameStateUpdate', (gameState) => {
	// Update game UI based on the gameState object
	console.log('Client detecting gameStateUpdate event');
	renderGame(gameState);
});

socket.on('gameOver', (winner) => {
	console.log('Client detecting gameOver event');
	renderGameOver(winner);
});