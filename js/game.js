const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const backToMenuButton = document.createElement('button');
backToMenuButton.innerText = "Zurück zum Menü";
backToMenuButton.id = "backToMenuButton";
backToMenuButton.style.display = 'none';
document.body.appendChild(backToMenuButton);

const mobileStartButton = document.createElement('button');
mobileStartButton.innerText = "Start";
mobileStartButton.id = "mobileStartButton";
mobileStartButton.style.display = 'none';
document.body.appendChild(mobileStartButton);

const mobileControls = document.getElementById('mobileControls');
const moveLeftButton = document.getElementById('moveLeftButton');
const moveRightButton = document.getElementById('moveRightButton');
const jumpButton = document.getElementById('jumpButton');
const attackButton = document.getElementById('attackButton');

let isMobile = false;
let scaleFactor = 1;
let musicEnabled = true; // Variable to store music state

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
    scaleFactor = canvas.height / 600;  // Adjust the scale factor based on the height of the canvas
}

function checkMobile() {
    if (window.innerWidth < 768) {
        isMobile = true;
    } else {
        isMobile = false;
    }
}

window.addEventListener('resize', () => {
    checkMobile();
    resizeCanvas();
});
checkMobile();
resizeCanvas();

moveLeftButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    hero.dx = -hero.speed;
});

moveRightButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    hero.dx = hero.speed;
});

jumpButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

attackButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    attack();
});

moveLeftButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    hero.dx = 0;
});

moveRightButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    hero.dx = 0
});

let heroImages = {
    idle: new Image(),
    walk1: new Image(),
    walk2: new Image(),
    jump: new Image(),
    attack: new Image()
};

let hero2Images = {
    idle: new Image(),
    walk1: new Image(),
    walk2: new Image(),
    attack: new Image()
};

let hero3Images = {
    idle: new Image(),
    walk1: new Image(),
    walk2: new Image(),
    attack: new Image()
};

let hero4Images = {
    idle: new Image(),
    walk1: new Image(),
    walk2: new Image(),
    attack: new Image()
};

let hero5Images = {
    idle: new Image(),
    walk1: new Image(),
    walk2: new Image(),
    attack: new Image()
};

let backgroundImage = new Image();
let backgroundImage2 = new Image();
let enemyImage = new Image();
let bossImage = new Image();
let coinImage = new Image();
let platformImage = new Image();
let platformImage2 = new Image();
let speedBoostImage = new Image();

backgroundImage.src = 'assets/background.png';
backgroundImage2.src = 'assets/background2.png';
enemyImage.src = 'assets/enemy_character.png';
bossImage.src = 'assets/boss_character.png';
coinImage.src = 'assets/coin.png';
platformImage.src = 'assets/platform.png';
platformImage2.src = 'assets/platform2.png';
speedBoostImage.src = 'assets/speedboost.png';

hero2Images.idle.src = 'assets/hero2_idle.png';
hero2Images.walk1.src = 'assets/hero2_walk1.png';
hero2Images.walk2.src = 'assets/hero2_walk2.png';
hero2Images.attack.src = 'assets/hero2_attack.png';
hero3Images.idle.src = 'assets/hero3_idle.png';
hero3Images.walk1.src = 'assets/hero3_walk1.png';
hero3Images.walk2.src = 'assets/hero3_walk2.png';
hero3Images.attack.src = 'assets/hero3_attack.png';
hero4Images.idle.src = 'assets/hero4_idle.png';
hero4Images.walk1.src = 'assets/hero4_walk1.png';
hero4Images.walk2.src = 'assets/hero4_walk2.png';
hero4Images.attack.src = 'assets/hero4_attack.png';
hero5Images.idle.src = 'assets/hero5_idle.png';
hero5Images.walk1.src = 'assets/hero5_walk1.png';
hero5Images.walk2.src = 'assets/hero5_walk2.png';
hero5Images.attack.src = 'assets/hero5_attack.png';

// Portal Animation Setup
const portalFrames = [];
const portalFrameCount = 4; // Anzahl der Frames in der Animation
let currentPortalFrame = 0;

// Portalbilder laden
for (let i = 1; i <= portalFrameCount; i++) {
    let img = new Image();
    img.src = `assets/portal${i}.png`; // Use backticks for template literals
    portalFrames.push(img);
}

let portalAnimationInterval = 200; // Zeit in Millisekunden zwischen den Frames
let lastPortalFrameChange = 0;

let hero = {
    x: 50,
    y: canvas.height - 275 * scaleFactor,
    width: 37.5 * scaleFactor,
    height: 60 * scaleFactor,
    speed: 5,
    dx: 0,
    dy: 0,
    jumping: false,
    lives: 3, // Anzahl der Leben
    coinsCollected: 0,
    currentImage: heroImages.idle,
    walkCounter: 0,
    isAttacking: false,
    speedBoosted: false
};

let scrollOffset = 0;

const levels = [
    // Your levels configuration
    {
        background: backgroundImage,
        platforms: [ // Level 1
            { x: 0, y: canvas.height - 85 * scaleFactor, width: 4800 * scaleFactor, height: 10 * scaleFactor, visible: false },
            { x: 600, y: canvas.height - 210 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 800, y: canvas.height - 190 * scaleFactor, width: 80 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 1000, y: canvas.height - 220 * scaleFactor, width: 80 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage }
        ],
        enemies: [
            { x: 900, y: canvas.height - 200 * scaleFactor, width: 25 * scaleFactor, height: 25 * scaleFactor, originalY: canvas.height - 200 * scaleFactor, dy: 0.5 * scaleFactor }
        ],
        goal: { x: 1150, y: canvas.height - 340 * scaleFactor, width: 50 * scaleFactor, height: 50 * scaleFactor },
        coins: [
            { x: 750, y: canvas.height - 330 * scaleFactor, width: 20 * scaleFactor, height: 20 * scaleFactor, collected: false },
            { x: 950, y: canvas.height - 310 * scaleFactor, width: 20 * scaleFactor, height: 20 * scaleFactor, collected: false }
        ],
       
        boss: null,
        speedBoosts: [
           
        ]
    },
    {
        background: backgroundImage,
        platforms: [ // Level 2
            { x: 0, y: canvas.height - 85 * scaleFactor, width: 4000 * scaleFactor, height: 20 * scaleFactor, visible: false },
            { x: 150, y: canvas.height - 200 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 350, y: canvas.height - 160 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 350, y: canvas.height - 350 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 500, y: canvas.height - 240 * scaleFactor, width: 80 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 560, y: canvas.height - 430 * scaleFactor, width: 110 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 700, y: canvas.height - 310 * scaleFactor, width: 80 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 850, y: canvas.height - 290 * scaleFactor, width: 80 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 730, y: canvas.height - 450 * scaleFactor, width: 200 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage }
        ],
        enemies: [
            { x: 290, y: canvas.height - 200 * scaleFactor, width: 25 * scaleFactor, height: 25 * scaleFactor, originalY: canvas.height - 200 * scaleFactor, dy: 0.5 * scaleFactor },
            { x: 780, y: canvas.height - 390 * scaleFactor, width: 50 * scaleFactor, height: 50 * scaleFactor, originalY: canvas.height - 390 * scaleFactor, dy: 0.3 * scaleFactor }
        ],
        goal: { x: 950, y: canvas.height - 380 * scaleFactor, width: 50 * scaleFactor, height: 50 * scaleFactor },
        coins: [
            { x: 400, y: canvas.height - 220 * scaleFactor, width: 20 * scaleFactor, height: 20 * scaleFactor, collected: false },
            { x: 620, y: canvas.height - 300 * scaleFactor, width: 20 * scaleFactor, height: 20 * scaleFactor, collected: false }
        ],
        boss: null,
        speedBoosts: [
            { x: 520, y: canvas.height - 320 * scaleFactor, width: 30 * scaleFactor, height: 30 * scaleFactor, collected: false }
        ]
    },
    // Weitere Level hinzufügen
    {
        background: backgroundImage,
        platforms: [ // Level 3
            { x: 0, y: canvas.height - 85 * scaleFactor, width: 4000 * scaleFactor, height: 20 * scaleFactor, visible: false },
            { x: 285, y: canvas.height - 205 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 490, y: canvas.height - 250 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 690, y: canvas.height - 300 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
            { x: 890, y: canvas.height - 370 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage },
        ],
        enemies: [
            { x: 420, y: canvas.height - 260 * scaleFactor, width: 25 * scaleFactor, height: 25 * scaleFactor, originalY: canvas.height - 270 * scaleFactor, dy: 0.4 * scaleFactor },
            { x: 820, y: canvas.height - 360 * scaleFactor, width: 50 * scaleFactor, height: 50 * scaleFactor, originalY: canvas.height - 360 * scaleFactor, dy: 0.3 * scaleFactor }
        ],
        goal: { x: 1100, y: canvas.height - 450 * scaleFactor, width: 50 * scaleFactor, height: 50 * scaleFactor },
        coins: [
            { x: 350, y: canvas.height - 300 * scaleFactor, width: 20 * scaleFactor, height: 20 * scaleFactor, collected: false },
            { x: 750, y: canvas.height - 350 * scaleFactor, width: 20 * scaleFactor, height: 20 * scaleFactor, collected: false }
        ],
        boss: null,
        speedBoosts: [
            { x: 450, y: canvas.height - 290 * scaleFactor, width: 30 * scaleFactor, height: 30 * scaleFactor, collected: false }
        ]
    },
    {
        background: backgroundImage2,
        platforms: [ // Level 4
            { x: 0, y: canvas.height - 155 * scaleFactor, width: 4000 * scaleFactor, height: 20 * scaleFactor, visible: false },
            { x: 200, y: canvas.height - 250 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage2 },
            { x: 400, y: canvas.height - 300 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage2 },
            { x: 600, y: canvas.height - 350 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage2 },
            { x: 800, y: canvas.height - 400 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage2 },
            { x: 1000, y: canvas.height - 450 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage2 },
        ],
        enemies: [
            { x: 530, y: canvas.height - 320 * scaleFactor, width: 25 * scaleFactor, height: 25 * scaleFactor, originalY: canvas.height - 320 * scaleFactor, dy: 0.4 * scaleFactor },
            { x: 930, y: canvas.height - 420 * scaleFactor, width: 50 * scaleFactor, height: 50 * scaleFactor, originalY: canvas.height - 420 * scaleFactor, dy: 0.3 * scaleFactor }
        ],
        goal: { x: 1200, y: canvas.height - 500 * scaleFactor, width: 50 * scaleFactor, height: 50 * scaleFactor },
        coins: [
            { x: 300, y: canvas.height - 270 * scaleFactor, width: 20 * scaleFactor, height: 20 * scaleFactor, collected: false },
            { x: 700, y: canvas.height - 370 * scaleFactor, width: 20 * scaleFactor, height: 20 * scaleFactor, collected: false }
        ],
        boss: null,
        speedBoosts: [
            { x: 350, y: canvas.height - 290 * scaleFactor, width: 30 * scaleFactor, height: 30 * scaleFactor, collected: false }
        ]
    },
    {
        background: backgroundImage2,
        platforms: [ // Level 5 
            { x: 0, y: canvas.height - 155 * scaleFactor, width: 4000 * scaleFactor, height: 20 * scaleFactor, visible: false },
            { x: 100, y: canvas.height - 250 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage2 },
            { x: 300, y: canvas.height - 300 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage2 },
            { x: 500, y: canvas.height - 350 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage2 },
            { x: 700, y: canvas.height - 400 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage2 },
            { x: 900, y: canvas.height - 450 * scaleFactor, width: 120 * scaleFactor, height: 30 * scaleFactor, visible: true, image: platformImage2 },
        ],
        enemies: [
            { x: 630, y: canvas.height - 370 * scaleFactor, width: 25 * scaleFactor, height: 25 * scaleFactor, originalY: canvas.height - 370 * scaleFactor, dy: 0.4 * scaleFactor },
            { x: 1030, y: canvas.height - 420 * scaleFactor, width: 25 * scaleFactor, height: 25 * scaleFactor, originalY: canvas.height - 420 * scaleFactor, dy: 0.3 * scaleFactor }
        ],
        goal: { x: 1100, y: canvas.height - 500 * scaleFactor, width: 50 * scaleFactor, height: 50 * scaleFactor },
        coins: [
            { x: 250, y: canvas.height - 340 * scaleFactor, width: 20 * scaleFactor, height: 20 * scaleFactor, collected: false },
            { x: 650, y: canvas.height - 440 * scaleFactor, width: 20 * scaleFactor, height: 20 * scaleFactor, collected: false }
        ],
        boss: {
            x: 915, y: canvas.height - 500 * scaleFactor,
            width: 50 * scaleFactor, height: 50 * scaleFactor,
            originalY: canvas.height - 500 * scaleFactor,
            dy: 0, health: 5
        },
        speedBoosts: [
            { x: 450, y: canvas.height - 290 * scaleFactor, width: 30 * scaleFactor, height: 30 * scaleFactor, collected: false }
        ]
    }
];

let currentLevelIndex = 0;
let currentLevel = levels[currentLevelIndex];

let goalReached = false;
let gameStarted = false;
let heroSpeechBubbleVisible = false;
let bossSpeechBubbleVisible = false;
let heroSpeechBubbleTimer;
let bossSpeechBubbleTimer;
let message = '';
let showMessage = false;

document.getElementById('playButton').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('levelSelection').style.display = 'flex';
});

document.getElementById('controlsButton').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('controlsScreen').style.display = 'flex';
});

document.getElementById('settingsButton').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('settingsScreen').style.display = 'flex';
});

document.getElementById('quitButton').addEventListener('click', () => {
    window.close();
});

document.getElementById('backButton').addEventListener('click', () => {
    document.getElementById('controlsScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
});

document.getElementById('backButtonSettings').addEventListener('click', () => {
    document.getElementById('settingsScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
});

document.getElementById('characterSelection').addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        let selectedCharacter = e.target.getAttribute('data-character');
        heroImages.idle.src = `assets/${selectedCharacter}_idle.png`; // Use backticks for template literals
        heroImages.walk1.src = `assets/${selectedCharacter}_walk1.png`;
        heroImages.walk2.src = `assets/${selectedCharacter}_walk2.png`;
        heroImages.jump.src = `assets/${selectedCharacter}_jump.png`;
        heroImages.attack.src = `assets/${selectedCharacter}_attack.png`;
        heroImages.idle.onload = () => {
            console.log("Hero images loaded successfully.");
            document.getElementById('characterSelection').style.display = 'none';
            canvas.style.display = 'block';
            backToMenuButton.style.display = 'block';
            mobileStartButton.style.display = isMobile ? 'block' : 'none';
        };
        heroImages.idle.onerror = () => {
            console.error("Error loading hero images.");
        };
    }
});

document.getElementById('levelSelection').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        currentLevelIndex = parseInt(e.target.getAttribute('data-level'));
        currentLevel = levels[currentLevelIndex];
        document.getElementById('levelSelection').style.display = 'none';
        document.getElementById('characterSelection').style.display = 'flex';
    }
});

backToMenuButton.addEventListener('click', () => {
    resetToMainMenu();
});

mobileStartButton.addEventListener('click', () => {
    startGame()
});

const startGame = () => {
    gameStarted = true;
    mobileStartButton.style.display = 'none';
    mobileControls.style.display = 'flex';
    if (musicEnabled) {
        backgroundMusic.play();
    }
    gameLoop();
}

function resetToMainMenu() {
    gameStarted = false;
    hero.lives = 3;
    hero.coinsCollected = 0;
    currentLevelIndex = 0;
    currentLevel = levels[currentLevelIndex];
    resetHeroPosition();
    canvas.style.display = 'none';
    backToMenuButton.style.display = 'none';
    mobileStartButton.style.display = 'none';
    mobileControls.style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function drawHero() {
    ctx.drawImage(hero.currentImage, hero.x, hero.y, hero.width, hero.height);
}

function drawBackground() {
    const backgroundWidth = 800 * scaleFactor;
    const backgroundHeight = canvas.height; // Set background height to canvas height
    const repeatCount = Math.ceil((scrollOffset + canvas.width) / backgroundWidth);

    for (let i = 0; i <= repeatCount; i++) {
        ctx.drawImage(currentLevel.background, i * backgroundWidth - scrollOffset % backgroundWidth, canvas.height - backgroundHeight, backgroundWidth, backgroundHeight);
    }
}

function drawPlatforms() {
    currentLevel.platforms.forEach(platform => {
        if (platform.image) {
            ctx.drawImage(platform.image, platform.x - scrollOffset, platform.y, platform.width, platform.height);
        } else {
            ctx.fillStyle = platform.visible ? '#070439' : 'rgba(0, 0, 0, 0)';
            ctx.fillRect(platform.x - scrollOffset, platform.y, platform.width, platform.height);
        }
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

        // Display boss message if hero is close enough and message not already displayed
        if (Math.abs(hero.x - (boss.x - scrollOffset)) < 200 && !boss.messageDisplayed && !bossSpeechBubbleVisible) {
            boss.messageDisplayed = true;
            bossSpeechBubbleVisible = true;
            drawSpeechBubble(ctx, boss.x - scrollOffset - 75, boss.y - 120, 260, 90, 10, "I’m so stressed and nobody\nis as ambitious as I am");
            bossSpeechBubbleTimer = setTimeout(() => {
                bossSpeechBubbleVisible = false;
                heroSpeechBubbleVisible = true;
                heroSpeechBubbleTimer = setTimeout(() => {
                    heroSpeechBubbleVisible = false;
                }, 3000); // Display hero's speech bubble for 3 seconds
            }, 3000); // Wait 3 seconds before showing hero's thought bubble
        }
    }
}

function drawHeroSpeechBubble() {
    drawThoughtBubble(ctx, hero.x + 0, hero.y - 100, 170, 35, 10, " I should leave him...");
}

// Function to draw speech bubble (same as previously defined)
function drawSpeechBubble(ctx, x, y, width, height, radius, text) {
    let r = radius;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';

    const lines = text.split('\n');
    const lineHeight = 20;
    lines.forEach((line, index) => {
        ctx.fillText(line, x + 10, y + 22.5 + (index * lineHeight));
    });

    // Draw the tail of the speech bubble
    ctx.beginPath();
    ctx.moveTo(x + width / 2 - 1, y + height);
    ctx.lineTo(x + width / 2 + 35, y + height);
    ctx.lineTo(x + width / 1.2, y + height + 10);
    ctx.closePath();
    ctx.fill();
}

// Function to draw thought bubble for the hero
function drawThoughtBubble(ctx, x, y, width, height, radius, text) {
    let r = radius;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';

    const lines = text.split('\n');
    const lineHeight = 20;
    lines.forEach((line, index) => {
        ctx.fillText(line, x + 10, y + 22.5 + (index * lineHeight));
    });

    // Draw the tail of the thought bubble
    ctx.beginPath();
    ctx.ellipse(x + width / 2 - 65, y + height + 30, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + width / 2 - 50, y + height + 20, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + width / 2 - 25, y + height + 10, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawGoal() {
    drawPortal();
}

// Funktion zum Zeichnen des animierten Portals
function drawPortal() {
    if (Date.now() - lastPortalFrameChange > portalAnimationInterval) {
        currentPortalFrame = (currentPortalFrame + 1) % portalFrameCount;
        lastPortalFrameChange = Date.now();
    }
    let portal = portalFrames[currentPortalFrame];
    ctx.drawImage(portal, currentLevel.goal.x - scrollOffset, currentLevel.goal.y, currentLevel.goal.width, currentLevel.goal.height);
}

function drawLives() {
    ctx.fillStyle = 'black';
    ctx.font = '10px "Press Start 2P", cursive';
    ctx.fillText('Lives: ' + hero.lives, 10, 30);
}

function drawCoinsCollected() {
    ctx.fillStyle = 'black';
    ctx.font = '10px "Press Start 2P", cursive';
    ctx.fillText('Confidence: ' + hero.coinsCollected, 10, 60);
    ctx.fillText('Level: ' + (currentLevelIndex + 1), 10, 90);
}

function drawSpeedBoosts() {
    currentLevel.speedBoosts.forEach(boost => {
        if (!boost.collected) {
            ctx.drawImage(speedBoostImage, boost.x - scrollOffset, boost.y, boost.width, boost.height);
        }
    });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    if (showMessage || heroSpeechBubbleVisible || bossSpeechBubbleVisible) return; // Halt updates when showing message or speech bubbles
    hero.x += hero.dx;
    hero.y += hero.dy;

    if (hero.y + hero.height < canvas.height) {
        hero.dy += 1 * scaleFactor;
    } else {
        hero.dy = 0;
        hero.jumping = false;
        hero.currentImage = heroImages.idle;
        hero.y = canvas.height - hero.height;
    }

    if (hero.x < 0) {
        hero.x = 0;
    }

    // Unsichtbare Wand hinter dem Ziel hinzufügen
    if (hero.x + hero.width > currentLevel.goal.x + 500 - scrollOffset) {
        hero.x = currentLevel.goal.x + 500 - hero.width - scrollOffset;
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
        if (enemy.y > enemy.originalY + 10 * scaleFactor || enemy.y < enemy.originalY - 10 * scaleFactor) {
            enemy.dy *= -1;
        }

        if (hero.x + hero.width > enemy.x - scrollOffset &&
            hero.x < enemy.x + enemy.width - scrollOffset &&
            hero.y + hero.height > enemy.y &&
            hero.y < enemy.y + enemy.height) {
            hero.lives--;
            if (hero.lives <= 0) {
                displayMessage("You Died!");
                setTimeout(() => {
                    resetToCharacterSelection();
                }, 1000);
            } else {
                displayMessage("You Died!");
                setTimeout(() => {
                    resetHeroPosition();
                }, 1000);
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

    currentLevel.speedBoosts.forEach(boost => {
        if (!boost.collected &&
            hero.x + hero.width > boost.x - scrollOffset &&
            hero.x < boost.x + boost.width - scrollOffset &&
            hero.y + hero.height > boost.y &&
            hero.y < boost.y + boost.height) {
            boost.collected = true;
            hero.speedBoosted = true;
            hero.speed *= 2;
            setTimeout(() => {
                hero.speed /= 2;
                hero.speedBoosted = false;
            }, 5000);
        }
    });

    if (currentLevel.boss && !currentLevel.bossDefeated) {
        let boss = currentLevel.boss;
        boss.y += boss.dy;
        if (boss.y > boss.originalY + 10 * scaleFactor || boss.y < boss.originalY - 10 * scaleFactor) {
            boss.dy *= -1;
        }

        if (hero.isAttacking && hero.x + hero.width > boss.x - scrollOffset - 50 * scaleFactor &&
            hero.x < boss.x + boss.width - scrollOffset + 50 * scaleFactor &&
            hero.y + hero.height > boss.y - 50 * scaleFactor &&
            hero.y < boss.y + boss.height + 50 * scaleFactor) {
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
            if (hero.lives <= 0) {
                displayMessage("Du bist gestorben!");
                setTimeout(() => {
                    resetToCharacterSelection();
                }, 1000);
            } else {
                displayMessage("Du bist gestorben!");
                setTimeout(() => {
                    resetHeroPosition();
                }, 1000);
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

    const heroOffset = 0.2 * canvas.width;  // 40% from the left

    if (hero.x > heroOffset && hero.dx > 0) {
        scrollOffset += hero.dx;
        hero.x = heroOffset;
    } else if (scrollOffset > 0 && hero.dx < 0) {
        scrollOffset += hero.dx;
        hero.x = heroOffset;
    }

    if (scrollOffset < 0) {
        scrollOffset = 0;
        hero.x += hero.dx;
    }
}

function resetHeroPosition() {
    hero.x = 50;
    hero.y = canvas.height - 400 * scaleFactor;
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
    canvas.style.display = 'none';
    backToMenuButton.style.display = 'none';
    mobileControls.style.display = 'none';
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function moveHero(e) {
    if (!isMobile) {
        if (e.key === 'ArrowRight') {
            hero.dx = hero.speed;
        } else if (e.key === 'ArrowLeft') {
            hero.dx = -hero.speed;
        }
    }
}

function stopHero(e) {
    if (!isMobile) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            hero.dx = 0;
        }
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

function jump() {
    if (!hero.jumping) {
        hero.dy = -15 * scaleFactor;
        hero.jumping = true;
        hero.currentImage = heroImages.jump;
    }
}

function displayMessage(msg) {
    message = msg;
    showMessage = true;
    setTimeout(() => {
        showMessage = false;
        message = '';
    }, 1000); // Display message for 1 second
}

function nextLevel() {
    currentLevelIndex++;
    if (currentLevelIndex >= levels.length) {
        alert('You completed all levels!');
        currentLevelIndex = 0;
        currentLevel = levels[currentLevelIndex];
        resetHeroPosition();
        goalReached = false;
        gameLoop();
    } else {
        currentLevel = levels[currentLevelIndex];
        resetHeroPosition();
        goalReached = false;
        gameLoop();
    }
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
    drawSpeedBoosts();
    if (bossSpeechBubbleVisible) {
        drawSpeechBubble(ctx, currentLevel.boss.x - scrollOffset - 145, currentLevel.boss.y - 85, 215, 55, 10, "I’m so stressed and nobody\nis as ambitious as I am");
    }
    if (heroSpeechBubbleVisible) {
        drawHeroSpeechBubble();
    }
    if (showMessage) {
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.fillText(message, canvas.width / 2 - 50, canvas.height / 2);
    } else {
        update();
    }

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

// Menü-Navigation mit Pfeiltasten
const menus = {
    startScreen: {
        buttons: document.querySelectorAll('#startScreen .menu button'),
        currentIndex: 0
    },
    controlsScreen: {
        buttons: document.querySelectorAll('#controlsScreen button'),
        currentIndex: 0
    },
    characterSelection: {
        buttons: document.querySelectorAll('#characterSelection img'),
        currentIndex: 0
    },
    levelSelection: {
        buttons: document.querySelectorAll('#levelSelection button'),
        currentIndex: 0
    },
    settingsScreen: {
        buttons: document.querySelectorAll('#settingsScreen button'),
        currentIndex: 0
    }
};

function updateFocusedButton(menu) {
    menu.buttons.forEach((button, index) => {
        if (index === menu.currentIndex) {
            button.classList.add('focused');
        } else {
            button.classList.remove('focused');
        }
    });
}

function navigateMenu(e, menu) {
    if (e.key === 'ArrowUp') {
        menu.currentIndex = (menu.currentIndex > 0) ? menu.currentIndex - 1 : menu.buttons.length - 1;
    } else if (e.key === 'ArrowDown') {
        menu.currentIndex = (menu.currentIndex < menu.buttons.length - 1) ? menu.currentIndex + 1 : 0;
    } else if (e.key === 'Enter') {
        menu.buttons[menu.currentIndex].click();
    }
    updateFocusedButton(menu);
}

document.addEventListener('keydown', (e) => {
    if (document.getElementById('startScreen').style.display === 'flex') {
        navigateMenu(e, menus.startScreen);
    } else if (document.getElementById('controlsScreen').style.display === 'flex') {
        navigateMenu(e, menus.controlsScreen);
    } else if (document.getElementById('characterSelection').style.display === 'flex') {
        navigateMenu(e, menus.characterSelection);
    } else if (document.getElementById('levelSelection').style.display === 'flex') {
        navigateMenu(e, menus.levelSelection);
    } else if (document.getElementById('settingsScreen').style.display === 'flex') {
        navigateMenu(e, menus.settingsScreen);
    }else{
        if(e.key === 'Enter'){
            startGame()
        }
    }
});

updateFocusedButton(menus.startScreen);

resizeCanvas();

document.getElementById('toggleSound').addEventListener('change', (e) => {
    musicEnabled = e.target.checked;
    if (musicEnabled) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
});
