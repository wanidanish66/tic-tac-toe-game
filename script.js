document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const cells = document.querySelectorAll('.cell');
    const currentPlayerDisplay = document.getElementById('current-player');
    const xScoreDisplay = document.getElementById('x-score');
    const oScoreDisplay = document.getElementById('o-score');
    const resetBtn = document.getElementById('reset-btn');
    const winningModal = document.querySelector('.winning-modal');
    const winMessage = document.getElementById('win-message');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    // Game state
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let xScore = 0;
    let oScore = 0;
    
    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Initialize the game
    function initGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        currentPlayerDisplay.textContent = currentPlayer;
        currentPlayerDisplay.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
            cell.style.pointerEvents = 'auto';
        });
        
        winningModal.classList.remove('show');
        winningModal.classList.add('hidden');
    }
    
    // Handle cell click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (board[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Update board and UI
        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        if (checkWin()) {
            handleWin();
            return;
        }
        
        if (checkDraw()) {
            handleDraw();
            return;
        }
        
        // Switch player
        switchPlayer();
    }
    
    // Switch player
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentPlayerDisplay.textContent = currentPlayer;
        currentPlayerDisplay.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
        
        // Add animation to player turn
        currentPlayerDisplay.parentElement.classList.remove('animate__fadeIn');
        void currentPlayerDisplay.parentElement.offsetWidth; // Trigger reflow
        currentPlayerDisplay.parentElement.classList.add('animate__fadeIn');
    }
    
    // Check for win
    function checkWin() {
        return winningConditions.some(condition => {
            const [a, b, c] = condition;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }
    
    // Handle win
    function handleWin() {
        gameActive = false;
        
        // Highlight winning cells
        const winningCondition = winningConditions.find(condition => {
            const [a, b, c] = condition;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
        
        winningCondition.forEach(index => {
            cells[index].classList.add('win');
        });
        
        // Update score
        if (currentPlayer === 'X') {
            xScore++;
            xScoreDisplay.textContent = xScore;
        } else {
            oScore++;
            oScoreDisplay.textContent = oScore;
        }
        
        // Show win message with animation
        winMessage.textContent = `Player ${currentPlayer} Wins!`;
        winMessage.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
        
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.remove('animate__bounceIn', 'animate__tada');
        void modalContent.offsetWidth; // Trigger reflow
        modalContent.classList.add('animate__bounceIn');
        
        winningModal.classList.remove('hidden');
        winningModal.classList.add('show');
        
        // Disable further clicks
        cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
        });
    }
    
    // Check for draw
    function checkDraw() {
        return board.every(cell => cell !== '');
    }
    
    // Handle draw
    function handleDraw() {
        gameActive = false;
        
        // Show draw message
        winMessage.textContent = "It's a Draw!";
        winMessage.style.color = 'var(--dark-color)';
        
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.remove('animate__bounceIn', 'animate__tada');
        void modalContent.offsetWidth; // Trigger reflow
        modalContent.classList.add('animate__tada');
        
        winningModal.classList.remove('hidden');
        winningModal.classList.add('show');
    }
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetBtn.addEventListener('click', initGame);
    
    playAgainBtn.addEventListener('click', () => {
        winningModal.classList.remove('show');
        winningModal.classList.add('hidden');
        initGame();
    });
    
    // Initialize the game
    initGame();
});