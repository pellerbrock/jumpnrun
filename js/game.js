// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const backToMenuButton = document.createElement('button');
backToMenuButton.innerText = "Zurück zum Menü";
backToMenuButton.id = "backToMenuButton";
backToMenuButton.style.display = 'none';
document.body.appendChild(backToMenuButton);

let heroImages = {
    idle: new Image(),
    walk1: new Image(),
    walk2: new Image(),
    jump: new Image(),
    attack: new Image()
};

let backgroundImage = new Image();
let enemyImage = new Image();
let bossImage = new Image();
let coinImage = new Image();

backgroundImage.src = 'assets/background.png';
enemyImage.src = 'assets/enemy_character.png';
bossImage.src = 'assets/boss_character.png';
coinImage.src = 'assets/coin.png';

let hero = {
    x: 50,
    y: canvas.height - 200,
    width: 50,
    height: 50,
    speed: 6,
    dx: 0,
    dy: 0,
    jumping: false,
    lives: 3, // Anzahl der Leben
    coinsCollected: 0,
    currentImage: heroImages.idle,
    walkCounter: 0,
    isAttacking: false
};

let scrollOffset = 0;

const levels = [
    {
        platforms: [
            { x: 0, y: canvas.height - 115, width: 1800, height: 20, visible: false },
            { x: 200, y: canvas.height - 230, width: 100, height: 10, visible: true },
            { x: 400, y: canvas.height - 210, width: 60, height: 10, visible: true },
            { x: 600, y: canvas.height - 190, width: 60, height: 10, visible: true }
        ],
        enemies: [
            { x: 500, y: canvas.height - 220, width: 50, height: 50, originalY: canvas.height - 220, dy: 0.5 }
        ],
        goal: { x: 750, y: canvas.height - 360, width: 50, height: 50 },
        coins: [
            { x: 350, y: canvas.height - 350, width: 20, height: 20, collected: false },
            { x: 550, y: canvas.height - 330, width: 20, height: 20, collected: false }
        ]
    },
    {
        platforms: [
            { x: 0, y: canvas.height - 115, width: 2000, height: 20, visible: false },
            { x: 150, y: canvas.height - 230, width: 100, height: 10, visible: true },
            { x: 350, y: canvas.height - 190, width: 100, height: 10, visible: true },
            { x: 350, y: canvas.height - 390, width: 100, height: 10, visible: true },
            { x: 500, y: canvas.height - 270, width: 60, height: 10, visible: true },
            { x: 580, y: canvas.height - 470, width: 90, height: 10, visible: true },
            { x: 700, y: canvas.height - 340, width: 60, height: 10, visible: true },
            { x: 850, y: canvas.height - 320, width: 60, height: 10, visible: true },
            { x: 730, y: canvas.height - 470, width: 180, height: 10, visible: true }
        ],
        enemies: [
            { x: 270, y: canvas.height - 230, width: 50, height: 50, originalY: canvas.height - 230, dy: 0.5 },
            { x: 780, y: canvas.height - 420, width: 50, height: 50, originalY: canvas.height - 420, dy: 0.3 }
        ],
        goal: { x: 950, y: canvas.height - 410, width: 50, height: 50 },
        coins: [
            { x: 400, y: canvas.height - 250, width: 20, height: 20, collected: false },
            { x: 620, y: canvas.height - 330, width: 20, height: 20, collected: false }
        ],
        boss: {
            x: 825,
            y: canvas.height - 570,
            width: 100,
            height: 100,
            originalY: canvas.height - 570,
            dy: 0,
            health: 5
        }
    }
];

let currentLevelIndex = 0;
let currentLevel = levels[currentLevelIndex];

let goalReached = false;
let gameStarted = false;

document.getElementById('playButton').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('characterSelection').style.display = 'flex';
});

document.getElementById('controlsButton').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('controlsScreen').style.display = 'flex';
});

document.getElementById('quitButton').addEventListener('click', () => {
    window.close();
});

document.getElementById('backButton').addEventListener('click', () => {
    document.getElementById('controlsScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
});

document.getElementById('characterSelection').addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        let selectedCharacter = e.target.getAttribute('data-character');
        heroImages.idle.src = `assets/${selectedCharacter}_idle.png`;
        heroImages.walk1.src = `assets/${selectedCharacter}_walk1.png`;
        heroImages.walk2.src = `assets/${selectedCharacter}_walk2.png`;
        heroImages.jump.src = `assets/${selectedCharacter}_jump.png`;
        heroImages.attack.src = `assets/${selectedCharacter}_attack.png`;
        heroImages.idle.onload = () => {
            console.log("Hero images loaded successfully.");
            document.getElementById('characterSelection').style.display = 'none';
            canvas.style.display = 'block';
            backToMenuButton.style.display = 'block';
            gameStarted = true;
            backgroundMusic.play();
            gameLoop();
        };
        heroImages.idle.onerror = () => {
            console.error("Error loading hero images.");
        };
    }
});

backToMenuButton.addEventListener('click', () => {
    resetToMainMenu();
});

function resetToMainMenu() {
    gameStarted = false;
    hero.lives = 3;
    hero.coinsCollected = 0;
    currentLevelIndex = 0;
    currentLevel = levels[currentLevelIndex];
    resetHeroPosition();
    canvas.style.display = 'none';
    backToMenuButton.style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function drawHero() {
    ctx.drawImage(hero.currentImage, hero.x, hero.y, hero.width, hero.height);
}

function drawBackground() {
    const backgroundWidth = backgroundImage.width;
    const backgroundHeight = backgroundImage.height;
    const repeatCount = Math.ceil((scrollOffset + canvas.width) / backgroundWidth);

    for (let i = 0; i <= repeatCount; i++) {
        ctx.drawImage(backgroundImage, i * backgroundWidth - scrollOffset % backgroundWidth, 0, backgroundWidth, backgroundHeight);
    }
}

function drawPlatforms() {
    currentLevel.platforms.forEach(platform => {
        if (platform.visible) {
            ctx.fillStyle = '#070439';
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        }
        ctx.fillRect(platform.x - scrollOffset, platform.y, platform.width, platform.height);
    });
}

function drawEnemies() {
    currentLevel.enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x - scrollOffset, enemy.y, enemy.width, enemy.height);
    });
}

function drawCoins() {
    currentLevel.coins.forEach(coin => {
        if (!coin.collected) {
            ctx.drawImage(coinImage, coin.x - scrollOffset, coin.y, coin.width, coin.height);
        }
    });
}

function drawBoss() {
    if (!currentLevel.bossDefeated && currentLevel.boss) {
        let boss = currentLevel.boss;
        ctx.drawImage(bossImage, boss.x - scrollOffset, boss.y, boss.width, boss.height);

        // Draw boss health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(boss.x - scrollOffset, boss.y - 10, boss.width, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(boss.x - scrollOffset, boss.y - 10, boss.width * (boss.health / 5), 5);
    }
}

function drawGoal() {
    let goal = currentLevel.goal;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(goal.x - scrollOffset, goal.y, goal.width, goal.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Goal!', goal.x - scrollOffset + 5, goal.y + 30);
}

function drawLives() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Lives: ' + hero.lives, 10, 30);
}

function drawCoinsCollected() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Coins: ' + hero.coinsCollected, 10, 60);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    hero.x += hero.dx;
    hero.y += hero.dy;

    if (hero.y + hero.height < canvas.height) {
        hero.dy += 1;
    } else {
        hero.dy = 0;
        hero.jumping = false;
        hero.currentImage = heroImages.idle;
        hero.y = canvas.height - hero.height;
    }

    currentLevel.platforms.forEach(platform => {
        if (hero.y + hero.height > platform.y &&
            hero.y + hero.height - hero.dy <= platform.y &&
            hero.x + hero.width > platform.x - scrollOffset &&
            hero.x < platform.x + platform.width - scrollOffset) {
            hero.dy = 0;
            hero.jumping = false;
            hero.y = platform.y - hero.height;
        }
    });

    currentLevel.enemies.forEach(enemy => {
        enemy.y += enemy.dy;
        if (enemy.y > enemy.originalY + 10 || enemy.y < enemy.originalY - 10) {
            enemy.dy *= -1;
        }

        if (hero.x + hero.width > enemy.x - scrollOffset &&
            hero.x < enemy.x + enemy.width - scrollOffset &&
            hero.y + hero.height > enemy.y &&
            hero.y < enemy.y + enemy.height) {
            hero.lives--;
            displayMessage("Du bist gestorben!");
            if (hero.lives <= 0) {
                resetToCharacterSelection();
            } else {
                resetHeroPosition();
            }
        }
    });

    currentLevel.coins.forEach(coin => {
        if (!coin.collected &&
            hero.x + hero.width > coin.x - scrollOffset &&
            hero.x < coin.x + coin.width - scrollOffset &&
            hero.y + hero.height > coin.y &&
            hero.y < coin.y + coin.height) {
            coin.collected = true;
            hero.coinsCollected++;
        }
    });

    if (currentLevel.boss && !currentLevel.bossDefeated) {
        let boss = currentLevel.boss;
        boss.y += boss.dy;
        if (boss.y > boss.originalY + 10 || boss.y < boss.originalY - 10) {
            boss.dy *= -1;
        }

        if (hero.isAttacking && hero.x + hero.width > boss.x - scrollOffset - 20 &&
            hero.x < boss.x + boss.width - scrollOffset + 20 &&
            hero.y + hero.height > boss.y - 20 &&
            hero.y < boss.y + boss.height + 20) {
            boss.health--;
            if (boss.health <= 0) {
                currentLevel.bossDefeated = true;
            }
        }

        if (!hero.isAttacking && hero.x + hero.width > boss.x - scrollOffset &&
            hero.x < boss.x + boss.width - scrollOffset &&
            hero.y + hero.height > boss.y &&
            hero.y < boss.y + boss.height) {
            hero.lives--;
            displayMessage("Du bist gestorben!");
            if (hero.lives <= 0) {
                resetToCharacterSelection();
            } else {
                resetHeroPosition();
            }
        }
    }

    let goal = currentLevel.goal;
    if (hero.x + hero.width > goal.x - scrollOffset &&
        hero.x < goal.x + goal.width - scrollOffset &&
        hero.y + hero.height > goal.y &&
        hero.y < goal.y + goal.height) {
        goalReached = true;
    }

    if (hero.dx !== 0 && !hero.jumping && !hero.isAttacking) {
        hero.walkCounter++;
        if (hero.walkCounter % 30 < 15) {  // Adjusted walk animation speed
            hero.currentImage = heroImages.walk1;
        } else {
            hero.currentImage = heroImages.walk2;
        }
    } else if (!hero.jumping && !hero.isAttacking) {
        hero.currentImage = heroImages.idle;
    }

    if (hero.x > canvas.width / 2 && hero.dx > 0) {
        scrollOffset += hero.dx;
        hero.x = canvas.width / 2;
    } else if (scrollOffset > 0 && hero.dx < 0) {
        scrollOffset += hero.dx;
        hero.x = canvas.width / 2;
    }

    if (scrollOffset < 0) {
        scrollOffset = 0;
        hero.x += hero.dx;
    }
}

function resetHeroPosition() {
    hero.x = 50;
    hero.y = canvas.height - 200;
    hero.dx = 0;
    hero.dy = 0;
    hero.isAttacking = false;
    scrollOffset = 0;
}

function resetToCharacterSelection() {
    gameStarted = false;
    hero.lives = 3;
    hero.coinsCollected = 0;
    currentLevelIndex = 0;
    currentLevel = levels[currentLevelIndex];
    resetHeroPosition();
    document.getElementById('characterSelection').style.display = 'flex';
}

function moveHero(e) {
    if (e.key === 'ArrowRight') {
        hero.dx = hero.speed;
    } else if (e.key === 'ArrowLeft') {
        hero.dx = -hero.speed;
    }
}

function stopHero(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        hero.dx = 0;
    }
}

function jump() {
    if (!hero.jumping) {
        hero.dy = -15;
        hero.jumping = true;
        hero.currentImage = heroImages.jump;
    }
}

function attack() {
    if (!hero.isAttacking) {
        hero.isAttacking = true;
        hero.currentImage = heroImages.attack;
        setTimeout(() => {
            hero.isAttacking = false;
            hero.currentImage = heroImages.idle;
        }, 500);
    }
}

function displayMessage(message) {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(message, canvas.width / 2 - 50, canvas.height / 2);
}

function nextLevel() {
    currentLevelIndex++;
    if (currentLevelIndex >= levels.length) {
        alert('You completed all levels!');
        currentLevelIndex = 0;
    }
    currentLevel = levels[currentLevelIndex];
    resetHeroPosition();
    goalReached = false;
    gameLoop();
}

function gameLoop() {
    if (!gameStarted) return;
    clear();
    drawBackground();
    drawHero();
    drawPlatforms();
    drawEnemies();
    drawCoins();
    drawBoss();
    drawGoal();
    drawLives();
    drawCoinsCollected();
    update();

    if (goalReached) {
        displayMessage("You Win!");
        setTimeout(nextLevel, 2000);
    } else {
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', moveHero);
document.addEventListener('keyup', stopHero);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') jump();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'x') attack();
});
