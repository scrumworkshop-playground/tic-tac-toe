const boardElem = document.getElementById('board');
const newGameBtn = document.getElementById('newGameBtn');
const modeSelect = document.getElementById('modeSelect');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let mode = '2p';

function renderBoard() {
    boardElem.innerHTML = '';
    board.forEach((cell, idx) => {
        const cellElem = document.createElement('div');
        cellElem.className = 'cell';
        cellElem.textContent = cell || '';
        cellElem.addEventListener('click', () => handleCellClick(idx));
        boardElem.appendChild(cellElem);
    });
}

function handleCellClick(idx) {
    if (!gameActive || board[idx]) return;
    board[idx] = currentPlayer;
    renderBoard();
    if (checkWin(currentPlayer)) {
        setTimeout(() => alert(`${currentPlayer} wins!`), 100);
        gameActive = false;
        return;
    }
    if (board.every(cell => cell)) {
        setTimeout(() => alert('Draw!'), 100);
        gameActive = false;
        return;
    }
    if (mode === 'ai' && currentPlayer === 'X') {
        currentPlayer = 'O';
        setTimeout(aiMove, 400);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function aiMove() {
    // Simple AI: pick random empty cell
    const empty = board.map((cell, i) => cell ? null : i).filter(i => i !== null);
    if (empty.length === 0) return;
    const move = empty[Math.floor(Math.random() * empty.length)];
    board[move] = 'O';
    renderBoard();
    if (checkWin('O')) {
        setTimeout(() => alert('O wins!'), 100);
        gameActive = false;
        return;
    }
    if (board.every(cell => cell)) {
        setTimeout(() => alert('Draw!'), 100);
        gameActive = false;
        return;
    }
    currentPlayer = 'X';
}

function checkWin(player) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // cols
        [0,4,8],[2,4,6]          // diags
    ];
    return wins.some(line => line.every(i => board[i] === player));
}

function newGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    renderBoard();
    if (mode === 'ai' && currentPlayer === 'O') {
        setTimeout(aiMove, 400);
    }
}

newGameBtn.addEventListener('click', newGame);
modeSelect.addEventListener('change', e => {
    mode = e.target.value;
    newGame();
});

// Initial render
renderBoard(); 