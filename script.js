class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'human'; // 'human' or 'ai'
        this.aiDifficulty = 'easy'; // 'easy', 'medium', 'hard'
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };

        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.initializeGame();
    }

    initializeGame() {
        this.bindEvents();
        this.updateScoreDisplay();
        this.updateCurrentPlayerDisplay();
        this.updatePlayerLabels();
    }

    bindEvents() {
        // Cell click events
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        // Button events
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.playAgain());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());

        // Game mode selection
        document.getElementById('humanVsHuman').addEventListener('click', () => this.setGameMode('human'));
        document.getElementById('humanVsAI').addEventListener('click', () => this.setGameMode('ai'));

        // AI difficulty selection
        document.getElementById('easyAI').addEventListener('click', () => this.setAIDifficulty('easy'));
        document.getElementById('mediumAI').addEventListener('click', () => this.setAIDifficulty('medium'));
        document.getElementById('hardAI').addEventListener('click', () => this.setAIDifficulty('hard'));

        // Modal click outside to close
        document.getElementById('gameModal').addEventListener('click', (e) => {
            if (e.target.id === 'gameModal') {
                this.closeModal();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setGameMode(mode) {
        this.gameMode = mode;
        
        // Update button states
        document.getElementById('humanVsHuman').classList.toggle('active', mode === 'human');
        document.getElementById('humanVsAI').classList.toggle('active', mode === 'ai');
        
        // Show/hide AI difficulty
        const aiDifficultyDiv = document.getElementById('aiDifficulty');
        aiDifficultyDiv.style.display = mode === 'ai' ? 'block' : 'none';
        
        this.updatePlayerLabels();
        this.resetGame();
    }

    setAIDifficulty(difficulty) {
        this.aiDifficulty = difficulty;
        
        // Update button states
        document.getElementById('easyAI').classList.toggle('active', difficulty === 'easy');
        document.getElementById('mediumAI').classList.toggle('active', difficulty === 'medium');
        document.getElementById('hardAI').classList.toggle('active', difficulty === 'hard');
        
        this.resetGame();
    }

    updatePlayerLabels() {
        const player1Label = document.getElementById('player1Label');
        const player2Label = document.getElementById('player2Label');
        
        if (this.gameMode === 'ai') {
            player1Label.textContent = 'Human (X)';
            player2Label.textContent = `AI ${this.aiDifficulty.toUpperCase()} (O)`;
        } else {
            player1Label.textContent = 'Player X';
            player2Label.textContent = 'Player O';
        }
    }

    handleCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.dataset.index);

        if (this.board[cellIndex] !== '' || !this.gameActive) {
            return;
        }

        // Only allow human moves in AI mode when it's X's turn (human)
        if (this.gameMode === 'ai' && this.currentPlayer === 'O') {
            return;
        }

        this.makeMove(cellIndex);
    }

    makeMove(cellIndex) {
        this.board[cellIndex] = this.currentPlayer;
        this.updateCellDisplay(cellIndex);
        
        if (this.checkWinner()) {
            this.handleGameEnd('win');
        } else if (this.checkDraw()) {
            this.handleGameEnd('draw');
        } else {
            this.switchPlayer();
            
            // If it's AI's turn, make AI move
            if (this.gameMode === 'ai' && this.currentPlayer === 'O' && this.gameActive) {
                setTimeout(() => this.makeAIMove(), 500); // Small delay for better UX
            }
        }
    }

    makeAIMove() {
        if (!this.gameActive) return;

        const availableMoves = this.getAvailableMoves();
        if (availableMoves.length === 0) return;

        let aiMove;
        
        switch (this.aiDifficulty) {
            case 'easy':
                aiMove = this.getRandomMove(availableMoves);
                break;
            case 'medium':
                aiMove = this.getMediumMove(availableMoves);
                break;
            case 'hard':
                aiMove = this.getHardMove();
                break;
            default:
                aiMove = this.getRandomMove(availableMoves);
        }

        // Add visual feedback for AI thinking
        const cell = document.querySelector(`[data-index="${aiMove}"]`);
        cell.classList.add('ai-thinking');
        
        setTimeout(() => {
            cell.classList.remove('ai-thinking');
            this.makeMove(aiMove);
        }, 800);
    }

    getAvailableMoves() {
        return this.board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    }

    getRandomMove(availableMoves) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    getMediumMove(availableMoves) {
        // Medium AI: 50% chance to play optimally, 50% random
        if (Math.random() < 0.5) {
            return this.getHardMove();
        } else {
            return this.getRandomMove(availableMoves);
        }
    }

    getHardMove() {
        // Hard AI: Use minimax algorithm
        const bestMove = this.minimax(this.board, 0, true);
        return bestMove.index;
    }

    minimax(board, depth, isMaximizing) {
        const result = this.evaluateBoard(board);
        
        if (result !== null) {
            return { score: result };
        }

        const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            let bestMove = 0;
            
            for (let move of availableMoves) {
                board[move] = 'O'; // AI is O
                const score = this.minimax(board, depth + 1, false).score;
                board[move] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }
            
            return { score: bestScore, index: bestMove };
        } else {
            let bestScore = Infinity;
            let bestMove = 0;
            
            for (let move of availableMoves) {
                board[move] = 'X'; // Human is X
                const score = this.minimax(board, depth + 1, true).score;
                board[move] = '';
                
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }
            
            return { score: bestScore, index: bestMove };
        }
    }

    evaluateBoard(board) {
        // Check for winner
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a] === 'O' ? 10 : -10; // O (AI) wins: +10, X (Human) wins: -10
            }
        }
        
        // Check for draw
        if (board.every(cell => cell !== '')) {
            return 0;
        }
        
        return null; // Game not finished
    }

    updateCellDisplay(cellIndex) {
        const cell = document.querySelector(`[data-index="${cellIndex}"]`);
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
    }

    checkWinner() {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.highlightWinningCells(condition);
                return true;
            }
        }
        return false;
    }

    highlightWinningCells(winningCells) {
        winningCells.forEach(index => {
            document.querySelector(`[data-index="${index}"]`).classList.add('winning');
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateCurrentPlayerDisplay();
    }

    updateCurrentPlayerDisplay() {
        const currentPlayerText = document.getElementById('currentPlayerText');
        if (this.gameActive) {
            if (this.gameMode === 'ai') {
                if (this.currentPlayer === 'X') {
                    currentPlayerText.textContent = "Your Turn (X)";
                    currentPlayerText.style.background = 'linear-gradient(45deg, #e53e3e, #c53030)';
                } else {
                    currentPlayerText.textContent = "AI's Turn (O)";
                    currentPlayerText.style.background = 'linear-gradient(45deg, #3182ce, #2c5aa0)';
                }
            } else {
                currentPlayerText.textContent = `Player ${this.currentPlayer}'s Turn`;
                currentPlayerText.style.background = this.currentPlayer === 'X' ? 
                    'linear-gradient(45deg, #e53e3e, #c53030)' : 
                    'linear-gradient(45deg, #3182ce, #2c5aa0)';
            }
        }
    }

    handleGameEnd(result) {
        this.gameActive = false;
        
        if (result === 'win') {
            this.scores[this.currentPlayer]++;
            
            let winMessage;
            if (this.gameMode === 'ai') {
                if (this.currentPlayer === 'X') {
                    winMessage = "🎉 You Win! 🏆";
                    this.showModal(winMessage, "Congratulations! You beat the AI!");
                } else {
                    winMessage = "🤖 AI Wins! 🏆";
                    this.showModal(winMessage, "The AI got you this time! Try again?");
                }
            } else {
                winMessage = `🎉 Player ${this.currentPlayer} Wins! 🏆`;
                this.showModal(winMessage, `Congratulations! Player ${this.currentPlayer} has won this round!`);
            }
            
            this.updateGameStatus(`${this.currentPlayer === 'X' && this.gameMode === 'ai' ? 'You' : (this.gameMode === 'ai' ? 'AI' : `Player ${this.currentPlayer}`)} Win${this.currentPlayer === 'X' && this.gameMode === 'ai' ? '' : 's'}!`);
        } else if (result === 'draw') {
            this.scores.draw++;
            this.showModal(`🤝 It's a Draw! 🤝`, `Great game! ${this.gameMode === 'ai' ? 'You and the AI' : 'Both players'} played well!`);
            this.updateGameStatus("It's a Draw!");
        }
        
        this.updateScoreDisplay();
        this.updateCurrentPlayerDisplay();
    }

    updateGameStatus(message) {
        document.getElementById('gameStatus').textContent = message;
    }

    updateScoreDisplay() {
        document.getElementById('scoreX').textContent = this.scores.X;
        document.getElementById('scoreO').textContent = this.scores.O;
        document.getElementById('scoreDraw').textContent = this.scores.draw;
    }

    showModal(title, message) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        document.getElementById('gameModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('gameModal').classList.remove('show');
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.updateCurrentPlayerDisplay();
        this.updateGameStatus('');
        this.closeModal();
    }

    newGame() {
        this.resetGame();
        this.scores = { X: 0, O: 0, draw: 0 };
        this.updateScoreDisplay();
    }

    playAgain() {
        this.resetGame();
    }
}

// Game state management
let game;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    game = new TicTacToe();
    
    // Add some visual feedback
    console.log('🎮 Tic Tac Toe Game Loaded - Brno Scrum Workshop Edition!');
    console.log('📝 How to play:');
    console.log('   • Choose Human vs Human or Human vs AI mode');
    console.log('   • Select AI difficulty (Easy/Medium/Hard)');
    console.log('   • Click on any empty cell to make your move');
    console.log('   • First player to get 3 in a row wins!');
    console.log('   • Use Reset Game to clear the board');
    console.log('   • Use New Game to reset scores');
});

// Add keyboard support for cells (1-9 keys)
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9' && game && game.gameActive) {
        const cellIndex = parseInt(e.key) - 1;
        const cell = document.querySelector(`[data-index="${cellIndex}"]`);
        
        // Only allow human moves
        if (cell && game.board[cellIndex] === '' && 
            (game.gameMode === 'human' || (game.gameMode === 'ai' && game.currentPlayer === 'X'))) {
            game.makeMove(cellIndex);
        }
    }
});

// Add sound effects (optional - using Web Audio API)
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let frequency;
        
        switch(type) {
            case 'move':
                frequency = 800;
                break;
            case 'win':
                frequency = 1200;
                break;
            case 'draw':
                frequency = 600;
                break;
            case 'ai':
                frequency = 1000;
                break;
            default:
                return;
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Fallback if audio context is not available
    }
}

// Enhanced version of the game with sound effects
class EnhancedTicTacToe extends TicTacToe {
    makeMove(cellIndex) {
        super.makeMove(cellIndex);
        try {
            if (this.gameMode === 'ai' && this.currentPlayer === 'O') {
                playSound('ai');
            } else {
                playSound('move');
            }
        } catch (e) {
            // Fallback if audio context is not available
        }
    }
    
    handleGameEnd(result) {
        super.handleGameEnd(result);
        try {
            playSound(result === 'win' ? 'win' : 'draw');
        } catch (e) {
            // Fallback if audio context is not available
        }
    }
}

// Replace the basic game with enhanced version
document.addEventListener('DOMContentLoaded', () => {
    game = new EnhancedTicTacToe();
}); 