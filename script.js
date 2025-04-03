// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
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
