# Tic Tac Toe Web Game

A simple web-based Tic Tac Toe game with two modes:
1. Two-player mode - Play against another person
2. AI mode - Play against a computer opponent

## Features

- Clean, modern UI
- Two game modes
- Responsive design
- Simple AI opponent that:
  - Tries to win when possible
  - Blocks player's winning moves
  - Makes strategic moves (prefers center and corners)

## How to Play

1. Open `index.html` in a web browser
2. Choose your game mode:
   - Click "Two Players" to play against another person
   - Click "Play vs AI" to play against the computer
3. In two-player mode:
   - Players take turns clicking cells to place their X or O
   - Player X goes first
4. In AI mode:
   - You play as X and go first
   - The AI plays as O
5. Click "Reset Game" at any time to start over

## Technical Details

The game is built using vanilla HTML, CSS, and JavaScript with no external dependencies. The AI opponent uses a simple strategy that:
1. Looks for winning moves
2. Blocks opponent's winning moves
3. Prefers the center position
4. Takes corner positions when available
5. Takes any available position as a last resort