class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'human'; // 'human' or 'ai'
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };
        
        this.winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.gameStatusDisplay = document.getElementById('gameStatus');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.gameModeRadios = document.querySelectorAll('input[name="gameMode"]');
        this.scoreElements = {
            X: document.getElementById('scoreX'),
            O: document.getElementById('scoreO'),
            draw: document.getElementById('scoreDraw')
        };
        
        this.addEventListeners();
        this.updateDisplay();
        this.updateScoreDisplay();
    }
    
    addEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        this.newGameBtn.addEventListener('click', () => this.resetGame());
        
        this.gameModeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.gameMode = e.target.value;
                this.resetGame();
            });
        });
    }
    
    handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (this.board[clickedCellIndex] !== '' || !this.gameActive) {
            return;
        }
        
        this.makeMove(clickedCellIndex, this.currentPlayer);
        
        if (this.gameActive && this.gameMode === 'ai' && this.currentPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }
    
    makeMove(index, player) {
        this.board[index] = player;
        this.updateCellDisplay(index, player);
        
        if (this.checkWinner()) {
            this.gameActive = false;
            this.gameStatusDisplay.textContent = `Player ${player} wins!`;
            this.gameStatusDisplay.className = 'game-status winner';
            this.scores[player]++;
            this.updateScoreDisplay();
            this.highlightWinningCells();
        } else if (this.board.every(cell => cell !== '')) {
            this.gameActive = false;
            this.gameStatusDisplay.textContent = "It's a draw!";
            this.gameStatusDisplay.className = 'game-status draw';
            this.scores.draw++;
            this.updateScoreDisplay();
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateDisplay();
        }
    }
    
    makeAIMove() {
        if (!this.gameActive) return;
        
        const bestMove = this.getBestMove();
        this.makeMove(bestMove, 'O');
    }
    
    getBestMove() {
        // AI strategy: Try to win, block opponent, take center, take corner, take edge
        
        // Try to win
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                if (this.checkWinner()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Block opponent from winning
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                if (this.checkWinner()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Take center
        if (this.board[4] === '') {
            return 4;
        }
        
        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(index => this.board[index] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available edge
        const edges = [1, 3, 5, 7];
        const availableEdges = edges.filter(index => this.board[index] === '');
        if (availableEdges.length > 0) {
            return availableEdges[Math.floor(Math.random() * availableEdges.length)];
        }
        
        // Fallback: take any available cell
        const availableCells = this.board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }
    
    checkWinner() {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition;
            return this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c];
        });
    }
    
    highlightWinningCells() {
        this.winningConditions.forEach(condition => {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.cells[a].classList.add('winning');
                this.cells[b].classList.add('winning');
                this.cells[c].classList.add('winning');
            }
        });
    }
    
    updateCellDisplay(index, player) {
        this.cells[index].textContent = player;
        this.cells[index].classList.add(player.toLowerCase());
    }
    
    updateDisplay() {
        if (this.gameActive) {
            const playerName = this.gameMode === 'ai' && this.currentPlayer === 'O' ? 'AI (O)' : `Player ${this.currentPlayer}`;
            this.currentPlayerDisplay.textContent = `Current Player: ${playerName}`;
        }
    }
    
    updateScoreDisplay() {
        this.scoreElements.X.textContent = this.scores.X;
        this.scoreElements.O.textContent = this.scores.O;
        this.scoreElements.draw.textContent = this.scores.draw;
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameStatusDisplay.textContent = '';
        this.gameStatusDisplay.className = 'game-status';
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.updateDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
}); 