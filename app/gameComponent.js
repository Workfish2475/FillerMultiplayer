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
	
			//! Color assingment for captured tiles is null. WHY?!?!?
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

	gameState.players.forEach(player => {
		const gamePlayers = document.createElement('div');
		gamePlayers.className = 'player-names';
		gamePlayers.textContent = `${player}`;
		playerArea.appendChild(gamePlayers);
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
	//Kill me now.
});