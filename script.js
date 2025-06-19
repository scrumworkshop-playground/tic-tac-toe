const statusDisplay = document.querySelector('#status');
const board = document.querySelector('#board');
const resetButton = document.querySelector('#reset');
const cells = document.querySelectorAll('.cell');

let gameActive = true;
let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(event) {
    if (currentPlayer === 'O' && gameActive) {
        return; // It's not the human's turn
    }

    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (gameActive && currentPlayer === 'O') {
        board.style.pointerEvents = 'none';
        setTimeout(() => {
            aiMove();
            board.style.pointerEvents = 'auto';
        }, 750);
    }
}

function aiMove() {
    if (!gameActive) return;

    let availableCellIndices = [];
    gameState.forEach((cell, index) => {
        if (cell === "") {
            availableCellIndices.push(index);
        }
    });

    // To make AI a bit smarter, let's check for winning moves or blocking moves
    // 1. Check if AI can win
    for (let i = 0; i < availableCellIndices.length; i++) {
        const index = availableCellIndices[i];
        const tempGameState = [...gameState];
        tempGameState[index] = 'O';
        if (checkWin(tempGameState, 'O')) {
            const cell = document.querySelector(`.cell[data-index='${index}']`);
            handleCellPlayed(cell, index);
            handleResultValidation();
            return;
        }
    }

    // 2. Check if player can win and block
    for (let i = 0; i < availableCellIndices.length; i++) {
        const index = availableCellIndices[i];
        const tempGameState = [...gameState];
        tempGameState[index] = 'X';
        if (checkWin(tempGameState, 'X')) {
            const cell = document.querySelector(`.cell[data-index='${index}']`);
            handleCellPlayed(cell, index);
            handleResultValidation();
            return;
        }
    }

    // 3. Take center if available
    if (availableCellIndices.includes(4)) {
        const cell = document.querySelector(`.cell[data-index='4']`);
        handleCellPlayed(cell, 4);
        handleResultValidation();
        return;
    }
    
    // 4. Fallback to random move
    const randomIndex = Math.floor(Math.random() * availableCellIndices.length);
    const moveIndex = availableCellIndices[randomIndex];
    const cell = document.querySelector(`.cell[data-index='${moveIndex}']`);
    handleCellPlayed(cell, moveIndex);
    handleResultValidation();
}

function checkWin(boardState, player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === player && boardState[b] === player && boardState[c] === player) {
            return true;
        }
    }
    return false;
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => cell.innerHTML = "");
    board.style.pointerEvents = 'auto';
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleRestartGame); 