# 🎮 Tic Tac Toe Web Game

A modern, responsive Tic Tac Toe game built with HTML, CSS, and JavaScript. Features a beautiful UI, score tracking, animations, and sound effects!

## 🌟 Features

- **Interactive 3x3 Game Board**: Click to place X or O
- **Score Tracking**: Keeps track of wins for both players and draws
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradients, animations, and visual effects
- **Keyboard Support**: Use number keys 1-9 to place moves
- **Sound Effects**: Audio feedback for moves and game endings
- **Game Controls**: Reset current game or start completely new game
- **Modal Dialogs**: Elegant game-over notifications
- **Real-time Updates**: Live display of current player and game status

## 🚀 Quick Start

### Option 1: Python HTTP Server (Recommended)

1. **Run the server**:
   ```bash
   python3 server.py
   ```

2. **Open your browser**: The game will automatically open at `http://localhost:8000`

3. **Start playing**: Click on any cell to make your move!

### Option 2: Simple HTTP Server

If you prefer using Python's built-in server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### Option 3: Direct File Opening

You can also open `index.html` directly in your browser, though some features might be limited.

## 🎯 How to Play

1. **Player X** always goes first
2. Click on any empty cell to place your mark (X or O)
3. First player to get **3 in a row** (horizontally, vertically, or diagonally) wins!
4. If all 9 cells are filled without a winner, it's a draw

### Keyboard Controls

- **Number Keys 1-9**: Place move in corresponding cell position
- **Escape**: Close modal dialogs

```
Cell Layout:
1 | 2 | 3
---------
4 | 5 | 6
---------
7 | 8 | 9
```

## 🎨 Game Interface

### Score Board
- Tracks wins for Player X, Player O, and draws
- Updates automatically after each game

### Game Controls
- **Reset Game**: Clear the current board and start over
- **New Game**: Reset board and clear all scores

### Visual Feedback
- Winning cells are highlighted with animation
- Smooth transitions and hover effects
- Color-coded players (X = Red, O = Blue)

## 🛠️ Technical Details

### Files Structure
```
tic/
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
├── script.js       # Game logic and interactions
├── server.py       # Python HTTP server
└── README.md       # This file
```

### Technologies Used
- **HTML5**: Semantic structure and modern features
- **CSS3**: Flexbox, Grid, animations, and responsive design
- **JavaScript ES6+**: Classes, arrow functions, and modern syntax
- **Python 3**: Simple HTTP server for local hosting

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🎵 Sound Effects

The game includes optional sound effects using the Web Audio API:
- **Move Sound**: Played when placing X or O
- **Win Sound**: Played when a player wins
- **Draw Sound**: Played when the game ends in a draw

*Note: Sound effects require user interaction to work due to browser autoplay policies.*

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --player-x-color: #e53e3e;
    --player-o-color: #3182ce;
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Modifying Game Logic
The main game class is in `script.js`. You can easily:
- Change winning conditions
- Add new game modes
- Modify scoring system
- Add AI opponent

## 🐛 Troubleshooting

### Server Won't Start
- Make sure Python 3 is installed: `python3 --version`
- Check if the port is already in use
- Try a different port: modify `find_free_port()` in `server.py`

### Game Not Loading
- Ensure all files are in the same directory
- Check browser console for errors (F12)
- Try refreshing the page

### Sound Not Working
- Click anywhere on the page first (browser autoplay policy)
- Check if audio is muted
- Try in a different browser

## 📱 Mobile Experience

The game is fully responsive and touch-friendly:
- Optimized layouts for different screen sizes
- Touch-friendly button sizes
- Proper spacing for mobile interaction
- Vertical layout on small screens

## 🚀 Deployment

### Local Network Access
To allow other devices on your network to access the game:

1. Find your local IP address
2. Run: `python3 server.py`
3. Access from other devices using: `http://YOUR_IP:8000`

### Production Deployment
You can deploy this to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Apache/Nginx server

## 🤝 Contributing

Feel free to fork and improve this game! Some ideas:
- Add AI opponent with different difficulty levels
- Implement online multiplayer
- Add more game modes (5x5 grid, etc.)
- Create tournament mode
- Add themes and customization options

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Enjoy Playing!

Have fun with your Tic Tac Toe game! May the best player win! 🏆 