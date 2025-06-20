document.addEventListener("DOMContentLoaded", () => {
  const boardElement = document.getElementById("board");
  const statusElement = document.getElementById("status");
  const newGameButton = document.getElementById("newGame");

  let board; // array of 9 elements ("", "X", "O")
  let currentPlayer;
  let gameActive;

  function initBoard() {
    boardElement.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.addEventListener("click", () => handleCellClick(i));
      boardElement.appendChild(cell);
    }
  }

  function startGame() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;
    updateStatus(`Player ${currentPlayer}'s turn`);
    render();
  }

  function handleCellClick(index) {
    if (!gameActive || board[index] !== "") return;
    board[index] = currentPlayer;
    render();

    const winner = checkWinner();
    if (winner) {
      updateStatus(`Player ${winner} wins! 🎉`);
      gameActive = false;
    } else if (board.every((cell) => cell !== "")) {
      updateStatus("It's a draw! 🤝");
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateStatus(`Player ${currentPlayer}'s turn`);
    }
  }

  function checkWinner() {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of winConditions) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function render() {
    const cellDivs = boardElement.querySelectorAll(".cell");
    cellDivs.forEach((cellDiv, idx) => {
      cellDiv.textContent = board[idx];
    });
  }

  function updateStatus(message) {
    statusElement.textContent = message;
  }

  // Event Listeners
  newGameButton.addEventListener("click", startGame);

  // Initialize
  initBoard();
  startGame();
}); 
