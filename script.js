const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
const playerXButton = document.getElementById('playerX');
const playerOButton = document.getElementById('playerO');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');

const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let oTurn;
let humanPlayer;
let aiPlayer;
let scoreX = 0;
let scoreO = 0;

window.addEventListener('load', () => {
    Swal.fire({
        title: 'Welcome to Tic-Tac-Toe!',
        text: 'Choose your player (X or O) to start the game. The computer will be your opponent.',
        icon: 'info',
        confirmButtonText: 'Got it!'
    });
    playerXButton.disabled = false;
    playerOButton.disabled = false;
});

playerXButton.addEventListener('click', () => selectPlayer('X'));
playerOButton.addEventListener('click', () => selectPlayer('O'));
restartButton.addEventListener('click', () => {
    scoreX = 0;
    scoreO = 0;
    scoreXElement.innerText = scoreX;
    scoreOElement.innerText = scoreO;
    playerXButton.disabled = false;
    playerOButton.disabled = false;
    humanPlayer = undefined;
    aiPlayer = undefined;
    messageElement.innerText = "Choose your player";
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
    });
});

function selectPlayer(player) {
    humanPlayer = player === 'X' ? X_CLASS : O_CLASS;
    aiPlayer = player === 'X' ? O_CLASS : X_CLASS;
    playerXButton.disabled = true;
    playerOButton.disabled = true;
    startGame();
}

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    messageElement.innerText = "Your turn";
    if (humanPlayer === undefined) {
        // Default to player X if no selection is made
        humanPlayer = X_CLASS;
        aiPlayer = O_CLASS;
    }

    if (aiPlayer === X_CLASS) {
        // AI is X, so it goes first
        oTurn = false;
        setTimeout(aiMove, 500);
    } else {
        // Human is X, so they go first
        oTurn = false;
    }
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;

    // prevent player from clicking when it is not their turn
    if(currentClass !== humanPlayer) return;

    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
        return;
    }
    if (isDraw()) {
        endGame(true);
        return;
    }
    
    swapTurns();
    // It's now AI's turn
    setTimeout(aiMove, 500);
}

function endGame(draw) {
    let title, text;
    if (draw) {
        title = 'It\'s a Draw!';
        text = 'Nobody wins this round.';
    } else {
        const winner = !oTurn ? X_CLASS : O_CLASS; // The winner is the one who just played
        if(winner === humanPlayer) {
            title = 'You Win!';
            text = 'Congratulations!';
        } else {
            title = 'You Lose!';
            text = 'The computer beat you.';
        }
        updateScore(winner);
    }
    
    Swal.fire({
        title: title,
        text: text,
        icon: draw ? 'info' : (title === 'You Win!' ? 'success' : 'error'),
        confirmButtonText: 'Play Again'
    }).then(() => {
        startGame();
    });

    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function updateScore(winner) {
    if (winner === X_CLASS) {
        scoreX++;
        scoreXElement.innerText = scoreX;
    } else {
        scoreO++;
        scoreOElement.innerText = scoreO;
    }
}

function aiMove() {
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
    });

    if (availableCells.length === 0) return;

    // Simple AI: find winning move, else block, else random
    let move = findBestMove();
    
    placeMark(move, aiPlayer);

    if (checkWin(aiPlayer)) {
        endGame(false);
        return;
    }
    if (isDraw()) {
        endGame(true);
        return;
    }
    swapTurns(); // Swap back to player's turn
}

function findBestMove() {
    // 1. Check if AI can win
    for (let i = 0; i < cellElements.length; i++) {
        const cell = cellElements[i];
        if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
            cell.classList.add(aiPlayer);
            if (checkWin(aiPlayer)) {
                cell.classList.remove(aiPlayer);
                return cell;
            }
            cell.classList.remove(aiPlayer);
        }
    }

    // 2. Check if player can win and block
    for (let i = 0; i < cellElements.length; i++) {
        const cell = cellElements[i];
        if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
            cell.classList.add(humanPlayer);
            if (checkWin(humanPlayer)) {
                cell.classList.remove(humanPlayer);
                return cell;
            }
            cell.classList.remove(humanPlayer);
        }
    }

    // 3. Take center if available
    const centerCell = cellElements[4];
    if (!centerCell.classList.contains(X_CLASS) && !centerCell.classList.contains(O_CLASS)) {
        return centerCell;
    }

    // 4. Random available cell
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
    });
    return availableCells[Math.floor(Math.random() * availableCells.length)];
}

// Initial call to set up the board but not start the game
messageElement.innerText = "Choose your player to start"; 