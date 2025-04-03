// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeZiBtG1jkxW1X16kmzTRaYA1W-b4bp3U",
authDomain: "tic-tak-toe-5fb74.firebaseapp.com",
databaseURL: "https://tic-tak-toe-5fb74-default-rtdb.firebaseio.com",
projectId: "tic-tak-toe-5fb74",
storageBucket: "tic-tak-toe-5fb74.firebasestorage.app",
messagingSenderId: "1090880718932",
appId: "1:1090880718932:web:e41285d7e9d977ef1145c1",

};

// Initialize Firebase

const db = firebase.database();

let gameRef = db.ref("game");
let playerName = "";
let playerSymbol = "";

// Join Game
document.getElementById("joinGame").addEventListener("click", () => {
    playerName = document.getElementById("playerName").value.trim();
    if (!playerName) return alert("Enter your name to join the game!");
    
    gameRef.once("value", snapshot => {
        let data = snapshot.val() || {};
        if (!data.playerX) {
            gameRef.update({ playerX: playerName, currentTurn: "X", board: ["", "", "", "", "", "", "", "", ""] });
            playerSymbol = "X";
        } else if (!data.playerO) {
            gameRef.update({ playerO: playerName });
            playerSymbol = "O";
        } else {
            alert("Game is full!");
            return;
        }
        document.querySelector(".game-container").style.display = "block";
    });
});

// Handle Board Clicks
document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", () => {
        gameRef.once("value", snapshot => {
            let data = snapshot.val();
            if (data.currentTurn !== playerSymbol || data.board[cell.dataset.index] !== "") return;
            
            data.board[cell.dataset.index] = playerSymbol;
            data.currentTurn = playerSymbol === "X" ? "O" : "X";
            gameRef.update({ board: data.board, currentTurn: data.currentTurn });
        });
    });
});

// Listen for Board Changes
gameRef.on("value", snapshot => {
    let data = snapshot.val();
    if (!data) return;
    
    document.getElementById("turn").innerText = `Turn: ${data.currentTurn}`;
    
    document.querySelectorAll(".cell").forEach((cell, index) => {
        cell.innerText = data.board[index];
    });

    // Check for Winner
    let winner = checkWinner(data.board);
    if (winner) {
        document.getElementById("status").innerText = `${winner} Wins!`;
        gameRef.remove();
    }
});

// Function to Check Winner
function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Restart Game
document.getElementById("restart").addEventListener("click", () => {
    gameRef.remove();
    window.location.reload();
});
