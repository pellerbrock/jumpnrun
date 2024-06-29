const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');

let heroImage = new Image();
let backgroundImage = new Image();
let enemyImage = new Image();
backgroundImage.src = 'assets/background.png';
enemyImage.src = 'assets/enemy_character.png';

let hero = {
    x: 50,
    y: canvas.height - 200,
    width: 50,
    height: 50,
    speed: 6,
    dx: 0,
    dy: 0,
    jumping: false,
    lives: 3 // Anzahl der Leben
};

let scrollOffset = 0;

const levels = [
    {
        platforms: [
            { x: 0, y: canvas.height - 115, width: 800, height: 20, visible: false },
            { x: 200, y: canvas.height - 230, width: 100, height: 10, visible: true },
            { x: 400, y: canvas.height - 210, width: 60, height: 10, visible: true },
            { x: 600, y: canvas.height - 190, width: 60, height: 10, visible: true }
        ],
        enemies: [
            { x: 500, y: canvas.height - 180, width: 50, height: 50, originalY: canvas.height - 180, dy: 1 }
        ],
        goal: { x: 750, y: canvas.height - 360, width: 50, height: 50 }
    },
    {
        platforms: [
            { x: 0, y: canvas.height - 115, width: 1000, height: 20, visible: false },
            { x: 150, y: canvas.height - 230, width: 100, height: 10, visible: true },
            { x: 350, y: canvas.height - 190, width: 100, height: 10, visible: true },
            { x: 500, y: canvas.height - 270, width: 60, height: 10, visible: true },
            { x: 700, y: canvas.height - 340, width: 60, height: 10, visible: true },
            { x: 850, y: canvas.height - 320, width: 60, height: 10, visible: true }
        ],
        enemies: [
            { x: 270, y: canvas.height - 230, width: 50, height: 50, originalY: canvas.height - 230, dy: 1 },
            { x: 780, y: canvas.height - 350, width: 50, height: 50, originalY: canvas.height - 350, dy: 1 }
        ],
        goal: { x: 950, y: canvas.height - 410, width: 50, height: 50 }
    }
    // Weitere Level hier definieren...
];

let currentLevelIndex = 0;
let currentLevel = levels[currentLevelIndex];

let goalReached = false;
let gameStarted = false;

document.getElementById('characterSelection').addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        let selectedCharacter = e.target.getAttribute('data-character');
        heroImage.src = 'assets/' + selectedCharacter;
        heroImage.onload = () => {  
            console.log("Hero image loaded successfully.");
            document.getElementById('characterSelection').style.display = 'none';
            gameStarted = true;
            backgroundMusic.play();
            gameLoop();
        };
        heroImage.onerror = () => {  
            console.error("Error loading hero image.");
        };
    }
});

function drawHero() {
    ctx.drawImage(heroImage, hero.x, hero.y, hero.width, hero.height);
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
            if (hero.lives <= 0) {
                resetToCharacterSelection();
            } else {
                resetHeroPosition();
            }
        }
    });

    let goal = currentLevel.goal;
    if (hero.x + hero.width > goal.x - scrollOffset &&
        hero.x < goal.x + goal.width - scrollOffset &&
        hero.y + hero.height > goal.y &&
        hero.y < goal.y + goal.height) {
        goalReached = true;
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
    scrollOffset = 0;
}

function resetToCharacterSelection() {
    gameStarted = false;
    hero.lives = 3;
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
    drawGoal();
    drawLives();
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
