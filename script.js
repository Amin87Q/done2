const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const coin = document.getElementById("coin");
const scoreDisplay = document.getElementById("score");
const coinsDisplay = document.getElementById("coins");
const jumpButton = document.getElementById("jumpButton");
const conversionButton = document.getElementById("conversionButton");
const upgradeButton = document.getElementById("upgradeButton");
const totalScoreDisplay = document.getElementById("total-score");
const totalCoinsDisplay = document.getElementById("total-coins");

let score = parseInt(localStorage.getItem('currentScore')) || 0;
let coins = parseInt(localStorage.getItem('currentCoins')) || 0;
let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
let totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0;

let isJumping = false;
let gravity = 0.9;

function updateScore() {
    score++;
    totalScore++;
    scoreDisplay.textContent = "Score: " + score;
    totalScoreDisplay.textContent = totalScore;
    localStorage.setItem('currentScore', score);
    localStorage.setItem('totalScore', totalScore);
}

function updateCoins() {
    coins += 10; // اضافه کردن 10 سکه به‌طور تصادفی
    totalCoins += 10;
    coinsDisplay.textContent = "Coins: " + coins;
    totalCoinsDisplay.textContent = totalCoins;
    localStorage.setItem('currentCoins', coins);
    localStorage.setItem('totalCoins', totalCoins);
}

function jump() {
    if (isJumping) return;
    isJumping = true;

    let position = 0;
    const upInterval = setInterval(() => {
        if (position >= 100) { // Max jump height adjusted
            clearInterval(upInterval);

            const downInterval = setInterval(() => {
                if (position <= 0) { // Back to ground
                    clearInterval(downInterval);
                    isJumping = false;
                }
                position -= 5;
                position = position * gravity; // Apply gravity
                dino.style.bottom = `${position}px`;
            }, 20);
        } else {
            position += 5;
            dino.style.bottom = `${position}px`;
        }
    }, 20);
}

function checkCollision() {
    const dinoRect = dino.getBoundingClientRect();
    const cactusRect = cactus.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    if (
        dinoRect.right > cactusRect.left &&
        dinoRect.left < cactusRect.right &&
        dinoRect.bottom > cactusRect.top
    ) {
        showGameOverMessage();
    }

    if (
        dinoRect.right > coinRect.left &&
        dinoRect.left < coinRect.right &&
        dinoRect.bottom > coinRect.top
    ) {
        updateCoins();
        coin.style.display = "none"; // Hide coin after collecting
        setTimeout(() => {
            generateCoin();
        }, 2000);
    }
}

function showGameOverMessage() {
    alert(`Game Over!\nYour Score: ${score}\nCoins: ${coins}`);
    resetGame();
}

function resetGame() {
    score = 0;
    coins = 0;
    localStorage.setItem('currentScore', score);
    localStorage.setItem('currentCoins', coins);
    scoreDisplay.textContent = "Score: " + score;
    coinsDisplay.textContent = "Coins: " + coins;
    cactus.style.animation = "none";
    coin.style.animation = "none";
    setTimeout(() => {
        cactus.style.animation = "moveCactus 2s infinite linear";
        coin.style.animation = "moveCoin 4s infinite linear";
    }, 20);
}

function generateCoin() {
    coin.style.display = "block";
    // Random position for the coin
    const gameRect = document.getElementById('game').getBoundingClientRect();
    const maxX = gameRect.width - coin.offsetWidth;
    const randomX = Math.floor(Math.random() * maxX);
    coin.style.right = `${gameRect.width - randomX}px`;
}

// Event Listeners
document.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "ArrowUp") {
        jump();
    }
});

jumpButton.addEventListener("click", () => {
    jump();
});

conversionButton.addEventListener("click", () => {
    // عملکرد دکمه Conversion
    console.log("Conversion button clicked");
});

upgradeButton.addEventListener("click", () => {
    // عملکرد دکمه Upgrade
    console.log("Upgrade button clicked");
});

// Game loop
setInterval(() => {
    checkCollision();
    updateScore();
}, 100);
