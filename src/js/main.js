import '../scss/style.scss'

// ------------------------------------

const bird = document.querySelector('.bird');
const gameDisplay = document.querySelector('.game-container');
const ground = document.querySelector('.ground');
const sky = document.querySelector('.sky');
const restartBtn = document.querySelector('.game-over__button');

let birdLeft = 220;
let birdBottom = 100;
let gravity = 2;
let IsGameOver = false;
let gap = 430;

let obstacleIntervals = []; // Array to store obstacle movement intervals
let obstacleTimeoutId; // To store the obstacle generation timeout

let hasPassedObstacle = false; // Flag to track if the bird has passed the obstacle

function startGame(){
    birdBottom -= gravity;
    bird.style.bottom = birdBottom + 'px';
    bird.style.left = birdLeft + 'px';
}

let gameTimerId = setInterval(startGame, 20);

function jump(){
    if (birdBottom < 450){
        birdBottom += 50;
        bird.style.bottom = birdBottom + 'px';
    }
}

document.addEventListener('click', jump);

function generateObstacle() {
    if (IsGameOver) return; // Stop generating obstacles if the game is over

    let obstacleLeft = 500;
    let randomHeight = Math.random() * 60;
    let obstacleBottom = randomHeight;
    const obstacle = document.createElement('div');
    const topObstacle = document.createElement('div');

    let hasPassedObstacle = false; // Reset for new obstacle

    if (!IsGameOver) {
        obstacle.classList.add('obstacle');
        topObstacle.classList.add('topObstacle');
    }
    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(topObstacle);

    obstacle.style.left = obstacleLeft + 'px';
    topObstacle.style.left = obstacleLeft + 'px';

    obstacle.style.bottom = obstacleBottom + 'px';
    topObstacle.style.bottom = obstacleBottom + gap + 'px';

    function moveObstacle() {
        if (IsGameOver) return; // Obstacles stop moving if the game is over

        obstacleLeft -= 2;
        obstacle.style.left = obstacleLeft + 'px';
        topObstacle.style.left = obstacleLeft + 'px';

        // Remove obstacles once they are out of view
        if (obstacleLeft === -60) {
            gameDisplay.removeChild(obstacle);
            gameDisplay.removeChild(topObstacle);
            clearInterval(moveTimerId); // Clear the movement interval for this obstacle
        }

        // Check for collision with the obstacle
        if (obstacleLeft > 200 &&
            obstacleLeft < 280 &&
            birdLeft === 220 &&
            (birdBottom < obstacleBottom + 151 || birdBottom > obstacleBottom + gap - 200) ||
            birdBottom === 0
        ) {
            gameOver();
        }
        asdaspd

        // Play point sound if the bird passes the obstacle without collision
        if (!hasPassedObstacle && obstacleLeft < birdLeft) {
            const audioPoint = new Audio('/audio/point.ogg');
            audioPoint.play();
            hasPassedObstacle = true; // Ensure the sound plays only once per obstacle
        }
    }

    let moveTimerId = setInterval(moveObstacle, 20); // Obstacle movement
    obstacleIntervals.push(moveTimerId); // Store the movement interval for later clearing

    if (!IsGameOver) {
        obstacleTimeoutId = setTimeout(generateObstacle, 3000); // Generate the next obstacle
    }
}

generateObstacle();

function gameOver(){
    clearInterval(gameTimerId); // Stop the game loop
    IsGameOver = true;
    bird.style.animation = 'none';
    bird.style.transform = 'rotate(10deg)';
    document.querySelector('.game-over').style.zIndex = 1; // Show the "Game Over" screen

    document.removeEventListener('click', jump); // Disable jumping

    // Clear all obstacle movement intervals and the generation timeout
    obstacleIntervals.forEach(id => clearInterval(id));
    obstacleIntervals = [];
    clearTimeout(obstacleTimeoutId); // Stop generating new obstacles

   const audioGameOver = new Audio('/audio/die.ogg');
   audioGameOver.play()
}

function restartGame() {
    birdLeft = 220;
    birdBottom = 100;
    IsGameOver = false;

    // Remove all obstacles
    const obstacles = document.querySelectorAll('.obstacle, .topObstacle');
    obstacles.forEach(obstacle => obstacle.remove());

    // Reset bird's position and appearance
    bird.style.bottom = birdBottom + 'px';
    bird.style.left = birdLeft + 'px';
    bird.style.animation = '';
    bird.style.transform = 'rotate(0deg)';

    document.querySelector('.game-over').style.zIndex = -1;
    document.addEventListener('click', jump);

    gameTimerId = setInterval(startGame, 20);
    generateObstacle(); // Restart obstacle generation
}

// Attach the restart function to the "Restart" button
restartBtn.addEventListener('click', restartGame);


// ---------------Dark-Mode--------------------

const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if(isDarkMode){
    sky.style.backgroundImage = 'url("/images/background/background-night.png")';
    document.querySelector("body").style.backgroundColor = '#2C3136';
}
