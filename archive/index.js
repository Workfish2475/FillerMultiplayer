/*
const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: {origin: "*"}
});

let players = {};
let rooms = {
    'room1': {
        players: {},
        gameData: {}
    },
    'room2' : {
        players: {},
        gameData: {}
    }
};

io.on('connection', (socket) => {
    console.log('A user connected');
    let currentPlayerRoom = null;

    socket.on('move', (colorTarget, mainBoard, turn) => {
        if (!mainBoard) {
            console.error("mainBoard is undefined or null");
            return;
        }

        // Assuming you have a function to update the game state based on the move
        // For demonstration, simply toggling the turn and not modifying the mainBoard
        const updatedTurn = !turn;
        rooms[currentPlayerRoom].gameData.mainBoard = mainBoard;
        rooms[currentPlayerRoom].gameData.turn = updatedTurn;

        // Broadcast the updated game state to all players in the room
        io.to(currentPlayerRoom).emit('updateBoard', rooms[currentPlayerRoom].gameData.mainBoard, updatedTurn);
    });

    socket.on('join', (room, passedMainBoard, passedBoard) => {
        if (!rooms[room]) {
            rooms[room] = { players: {}, gameData: {} };
        }

        if (Object.keys(rooms[room].players).length < 2) {
            currentPlayerRoom = room; // Keep track of the room this player joined
            let role = Object.keys(rooms[room].players).length === 0 ? 'Player 1' : 'Player 2';
            rooms[room].players[socket.id] = {role: role};
            console.log(`Assigned ${role} in room ${room}`);

            socket.join(room);
            socket.emit('roleAssigned', role);
            io.to(room).emit('matchBoards', rooms[room].gameData.mainBoard || passedMainBoard);
        } else {
            console.log("Game is full.");
            socket.emit('gameFull');
            socket.disconnect();
        }
    });

    socket.on('disconnect', () => {
        console.log("A user disconnected");
        if (currentPlayerRoom && rooms[currentPlayerRoom] && rooms[currentPlayerRoom].players[socket.id]) {
            delete rooms[currentPlayerRoom].players[socket.id]; // Remove this player from the room

            if (Object.keys(rooms[currentPlayerRoom].players).length === 0) {
                // If the room is empty, delete it
                delete rooms[currentPlayerRoom];
            } else {
                // Notify the remaining player in the room about the disconnection
                io.to(currentPlayerRoom).emit('playerDisconnected', "Your opponent has disconnected.");
                // Optionally, reset the game state or adjust as necessary
            }
        }
    });
});

function updateGameState(gameState, colorTarget) {
    // Simplified example: toggle turn and set a recent move color
    gameState.turn = !gameState.turn;
    gameState.recentMoveColor = colorTarget;
    // Add more logic as needed for your game
}

http.listen(8080, () => console.log('Listening on port 8080'));
*/