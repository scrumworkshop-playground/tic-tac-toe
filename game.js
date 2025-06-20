class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = false;
        this.isAIMode = false;
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        // DOM elements
        this.cells = document.querySelectorAll('.cell');
        this.statusElement = document.getElementById('status');
        this.twoPlayerButton = document.getElementById('twoPlayerMode');
        this.aiButton = document.getElementById('aiMode');
        this.resetButton = document.getElementById('resetGame');

        // Event listeners
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        this.twoPlayerButton.addEventListener('click', () => this.startTwoPlayerMode());
        this.aiButton.addEventListener('click', () => this.startAIMode());
        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    startTwoPlayerMode() {
        this.isAIMode = false;
        this.resetGame();
        this.gameActive = true;
        this.statusElement.textContent = "Player X's turn";
    }

    startAIMode() {
        this.isAIMode = true;
        this.resetGame();
        this.gameActive = true;
        this.statusElement.textContent = "Your turn (X)";
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.cells.forEach(cell => cell.textContent = '');
        this.statusElement.textContent = this.isAIMode ? "Your turn (X)" : "Player X's turn";
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');
        
        if (!this.gameActive || this.board[index] !== '') {
            return;
        }

        this.makeMove(index);

        if (this.isAIMode && this.gameActive && this.currentPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;

        if (this.checkWin()) {
            this.gameActive = false;
            this.statusElement.textContent = `${this.currentPlayer} wins!`;
            return;
        }

        if (this.checkDraw()) {
            this.gameActive = false;
            this.statusElement.textContent = "It's a draw!";
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        if (this.gameActive) {
            this.statusElement.textContent = this.isAIMode ? 
                (this.currentPlayer === 'X' ? "Your turn (X)" : "AI thinking...") :
                `Player ${this.currentPlayer}'s turn`;
        }
    }

    makeAIMove() {
        if (!this.gameActive) return;

        // Simple AI: First try to win, then block opponent, then take center, 
        // then take corners, finally take any available space
        let move = this.findWinningMove('O') || 
                   this.findWinningMove('X') || 
                   this.findBestMove();

        if (move !== null) {
            this.makeMove(move);
        }
    }

    findWinningMove(player) {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === '') {
                this.board[i] = player;
                if (this.checkWin()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        return null;
    }

    findBestMove() {
        // Prefer center
        if (this.board[4] === '') return 4;

        // Then corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Then any available space
        const availableSpaces = this.board.map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);
        return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    }

    checkWin() {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
}

// Initialize the game
const game = new TicTacToe(); 