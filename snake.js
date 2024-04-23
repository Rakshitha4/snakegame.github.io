// Define constants for game elements
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

// Initialize game variables
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Retrieve high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Function to update food position
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30);
    foodY = Math.floor(Math.random() * 30);
};

// Function to handle game over
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
};

// Function to handle direction change
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Add event listeners to control buttons
controls.forEach(button => {
    button.addEventListener("click", () => {
        changeDirection({ key: button.dataset.key });
    });
});

// Initialize the game
const initGame = () => {
    if (gameOver) return handleGameOver();

    // Update food position if snake eats it
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = Math.max(score, highScore);
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Update snake's position
    snakeX += velocityX;
    snakeY += velocityY;

    // Check for wall collision
    if (snakeX < 0 || snakeY < 0 || snakeX >= 30 || snakeY >= 30) {
        gameOver = true;
        return handleGameOver();
    }

    // Check for self-collision
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][1] && snakeY === snakeBody[i][0]) {
            gameOver = true;
            return handleGameOver();
        }
    }

    // Shift snake's body
    snakeBody.unshift([snakeY, snakeX]);
    if (snakeBody.length > score + 1) {
        snakeBody.pop();
    }

    // Render game board
    let html = `<div class="food" style="grid-row: ${foodY + 1}; grid-column: ${foodX + 1};"></div>`;
    snakeBody.forEach(part => {
        html += `<div class="head" style="grid-row: ${part[0] + 1}; grid-column: ${part[1] + 1};"></div>`;
    });
    playBoard.innerHTML = html;
};

// Set initial food position and start game loop
updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
