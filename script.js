const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");
const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const startButton = document.getElementById("startGame");
const gameContainer = document.querySelector(".game-container");
const turnText = document.getElementById("turn");

let currentPlayer = "X";
let playerXName = "Player X";
let playerOName = "Player O";
let boardState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

// Start game
startButton.addEventListener("click", () => {
    if (playerXInput.value.trim() !== "") playerXName = playerXInput.value;
    if (playerOInput.value.trim() !== "") playerOName = playerOInput.value;
    
    gameContainer.style.display = "block";
    turnText.textContent = `${playerXName}'s Turn (X)`;
    gameActive = true;
});

// Handle cell click
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.dataset.index;
        if (boardState[index] === "" && gameActive) {
            boardState[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWinner();
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            turnText.textContent = currentPlayer === "X" ? `${playerXName}'s Turn (X)` : `${playerOName}'s Turn (O)`;
        }
    });
});

// Check winner
function checkWinner() {
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            gameActive = false;
            const winner = boardState[a] === "X" ? playerXName : playerOName;
            
            // Highlight winning cells
            cells[a].classList.add("winning-cell");
            cells[b].classList.add("winning-cell");
            cells[c].classList.add("winning-cell");

            // Delay winner announcement for visibility
            setTimeout(() => {
                statusText.textContent = `${winner} Wins! 🎉`;
                turnText.textContent = "";
            }, 500);
            
            return;
        }
    }
    
    if (!boardState.includes("")) {
        gameActive = false;
        statusText.textContent = "It's a Draw! 🤝";
        turnText.textContent = "";
    }
}

// Restart game
restartButton.addEventListener("click", () => {
    boardState.fill("");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winning-cell");
    });
    statusText.textContent = "";
    turnText.textContent = `${playerXName}'s Turn (X)`;
    gameActive = true;
    currentPlayer = "X";
});
