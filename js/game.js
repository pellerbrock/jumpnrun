const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const backToMenuButton = document.createElement('button');
backToMenuButton.innerText = "Zurück zum Menü";
backToMenuButton.id = "backToMenuButton";
backToMenuButton.style.display = 'none';
document.body.appendChild(backToMenuButton);

const mobileStartButton = document.getElementById('mobileStartButton');
const mobileControls = document.getElementById('mobileControls');
const moveLeftButton = document.getElementById('moveLeftButton');
const moveRightButton = document.getElementById('moveRightButton');
const jumpButton = document.getElementById('jumpButton');
const attackButton = document.getElementById('attackButton');

let isMobile = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function checkMobile() {
    if (window.innerWidth < 768) {
        isMobile = true;
        mobileStartButton.style.display = 'block';
    } else {
        isMobile = false;
        mobileStartButton.style.display = 'none';
    }
}

window.addEventListener('resize', checkMobile);
checkMobile();

mobileStartButton.addEventListener('click', () => {
    mobileStartButton.style.display = 'none';
    mobileControls.style.display = 'block';
    gameStarted = true;
    backgroundMusic.play();
    gameLoop();
});

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
    hero.dx = 0;
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
    walk2: new Image()
};

let hero3Images = {
    idle: new Image(),
    walk1: new Image(),
    walk2: new Image()
};

let hero4Images = {
    idle: new Image(),
    walk1: new Image(),
    walk2: new Image()
};

let hero5Images = {
    idle: new Image(),
    walk1: new Image(),
    walk2: new Image()
};

let backgroundImage = new Image();
let enemyImage = new Image();
let bossImage = new Image();
let coinImage = new Image();
let platformImage = new Image();
let speedBoostImage = new Image();

backgroundImage.src = 'assets/background2.png';
enemyImage.src = 'assets/enemy_character.png';
bossImage.src = 'assets/boss_character.png';
coinImage.src = 'assets/coin.png';
platformImage.src = 'assets/platform2.png';
speedBoostImage.src = 'assets/speedboost.png';

hero2Images.idle.src = 'assets/hero2_idle.png';
hero2Images.walk1.src = 'assets/hero2_walk1.png';
hero2Images.walk2.src = 'assets/hero2_walk2.png';
hero3Images.idle.src = 'assets/hero3_idle.png';
hero3Images.walk1.src = 'assets/hero3_walk1.png';
hero3Images.walk2.src = 'assets/hero3_walk2.png';
hero4Images.idle.src = 'assets/hero4_idle.png';
hero4Images.walk1.src = 'assets/hero4_walk1.png';
hero4Images.walk2.src = 'assets/hero4_walk2.png';
hero5Images.idle.src = 'assets/hero5_idle.png';
hero5Images.walk1.src = 'assets/hero5_walk1.png';
hero5Images.walk2.src = 'assets/hero5_walk2.png';

// Portal Animation Setup
const portalFrames = [];
const portalFrameCount = 4; // Anzahl der Frames in der Animation
let currentPortalFrame = 0;

// Portalbilder laden
for (let i = 1; i <= portalFrameCount; i++) {
    let img = new Image();
    img.src = `assets/portal${i}.png`;
    portalFrames.push(img);
}

let portalAnimationInterval = 500; // Zeit in Millisekunden zwischen den Frames
let lastPortalFrameChange = 0;

let hero = {
    x: 50,
    y: canvas.height - 275,
    width: 37.5,
    height: 60,
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
        platforms: [ // Level 1
            { x: 0, y: canvas.height - 115, width: 1800, height: 10, visible: false },
            { x: 700, y: canvas.height - 230, width: 100, height: 30, visible: true, image: platformImage },
            { x: 900, y: canvas.height - 210, width: 60, height: 30, visible: true, image: platformImage },
            { x: 1100, y: canvas.height - 190, width: 60, height: 30, visible: true, image: platformImage }
        ],
        enemies: [
            { x: 1000, y: canvas.height - 220, width: 25, height: 25, originalY: canvas.height - 220, dy: 0.5 }
        ],
        goal: { x: 1250, y: canvas.height - 360, width: 50, height: 50 },
        coins: [
            { x: 850, y: canvas.height - 350, width: 20, height: 20, collected: false },
            { x: 1050, y: canvas.height - 330, width: 20, height: 20, collected: false }
        ],
        boss: {
            x: 825,
            y: canvas.height - 170,
            width: 50,
            height: 50,
            originalY: canvas.height - 570,
            dy: 0,
            health: 5,
            intro: true
        },
        speedBoosts: [
            { x: 500, y: canvas.height - 150, width: 30, height: 30, collected: false }
        ]
    },
    {
        platforms: [ // Level 2
            { x: 0, y: canvas.height - 115, width: 2000, height: 20, visible: false },
            { x: 150, y: canvas.height - 230, width: 100, height: 30, visible: true, image: platformImage },
            { x: 350, y: canvas.height - 190, width: 100, height: 30, visible: true, image: platformImage },
            { x: 350, y: canvas.height - 390, width: 100, height: 30, visible: true, image: platformImage },
            { x: 500, y: canvas.height - 270, width: 60, height: 30, visible: true, image: platformImage },
            { x: 580, y: canvas.height - 470, width: 90, height: 30, visible: true, image: platformImage },
            { x: 700, y: canvas.height - 340, width: 60, height: 30, visible: true, image: platformImage },
            { x: 850, y: canvas.height - 320, width: 60, height: 30, visible: true, image: platformImage },
            { x: 730, y: canvas.height - 470, width: 180, height: 30, visible: true, image: platformImage }
        ],
        enemies: [
            { x: 270, y: canvas.height - 230, width: 25, height: 25, originalY: canvas.height - 230, dy: 0.5 },
            { x: 780, y: canvas.height - 420, width: 50, height: 50, originalY: canvas.height - 420, dy: 0.3 }
        ],
        goal: { x: 950, y: canvas.height - 410, width: 50, height: 50 },
        coins: [
            { x: 400, y: canvas.height - 250, width: 20, height: 20, collected: false },
            { x: 620, y: canvas.height - 330, width: 20, height: 20, collected: false }
        ],
        boss: null,
        speedBoosts: [
            { x: 600, y: canvas.height - 350, width: 30, height: 30, collected: false }
        ]
    },
    // Weitere Level hinzufügen
    {
        platforms: [ // Level 3
            { x: 0, y: canvas.height - 115, width: 2000, height: 20, visible: false },
            { x: 290, y: canvas.height - 220, width: 100, height: 30, visible: true, image: platformImage },
            { x: 490, y: canvas.height - 250, width: 100, height: 30, visible: true, image: platformImage },
            { x: 690, y: canvas.height - 300, width: 100, height: 30, visible: true, image: platformImage },
            { x: 890, y: canvas.height - 370, width: 100, height: 30, visible: true, image: platformImage },
        ],
        enemies: [
            { x: 400, y: canvas.height - 270, width: 25, height: 25, originalY: canvas.height - 270, dy: 0.4 },
            { x: 800, y: canvas.height - 370, width: 50, height: 50, originalY: canvas.height - 370, dy: 0.3 }
        ],
        goal: { x: 1100, y: canvas.height - 450, width: 50, height: 50 },
        coins: [
            { x: 350, y: canvas.height - 300, width: 20, height: 20, collected: false },
            { x: 750, y: canvas.height - 350, width: 20, height: 20, collected: false }
        ],
        boss: null,
        speedBoosts: [
            { x: 450, y: canvas.height - 290, width: 30, height: 30, collected: false }
        ]
    },
    {
        platforms: [ // Level 4
            { x: 0, y: canvas.height - 115, width: 2000, height: 20, visible: false },
            { x: 200, y: canvas.height - 200, width: 100, height: 30, visible: true, image: platformImage },
            { x: 400, y: canvas.height - 250, width: 100, height: 30, visible: true, image: platformImage },
            { x: 600, y: canvas.height - 300, width: 100, height: 30, visible: true, image: platformImage },
            { x: 800, y: canvas.height - 350, width: 100, height: 30, visible: true, image: platformImage },
            { x: 1000, y: canvas.height - 400, width: 100, height: 30, visible: true, image: platformImage },
        ],
        enemies: [
            { x: 530, y: canvas.height - 270, width: 25, height: 25, originalY: canvas.height - 270, dy: 0.4 },
            { x: 930, y: canvas.height - 370, width: 50, height: 50, originalY: canvas.height - 370, dy: 0.3 }
        ],
        goal: { x: 1200, y: canvas.height - 450, width: 50, height: 50 },
        coins: [
            { x: 300, y: canvas.height - 220, width: 20, height: 20, collected: false },
            { x: 700, y: canvas.height - 320, width: 20, height: 20, collected: false }
        ],
        boss: null,
        speedBoosts: [
            { x: 350, y: canvas.height - 240, width: 30, height: 30, collected: false }
        ]
    },
    {
        platforms: [ // Level 5 
            { x: 0, y: canvas.height - 115, width: 2000, height: 20, visible: false },
            { x: 100, y: canvas.height - 200, width: 100, height: 30, visible: true, image: platformImage },
            { x: 300, y: canvas.height - 250, width: 100, height: 30, visible: true, image: platformImage },
            { x: 500, y: canvas.height - 300, width: 100, height: 30, visible: true, image: platformImage },
            { x: 700, y: canvas.height - 350, width: 100, height: 30, visible: true, image: platformImage },
            { x: 900, y: canvas.height - 400, width: 100, height: 30, visible: true, image: platformImage },
        ],
        enemies: [
            { x: 630, y: canvas.height - 320, width: 25, height: 25, originalY: canvas.height - 320, dy: 0.4 },
            { x: 1030, y: canvas.height - 370, width: 25, height: 25, originalY: canvas.height - 370, dy: 0.3 }
        ],
        goal: { x: 1100, y: canvas.height - 450, width: 50, height: 50 },
        coins: [
            { x: 250, y: canvas.height - 290, width: 20, height: 20, collected: false },
            { x: 650, y: canvas.height - 390, width: 20, height: 20, collected: false }
        ],
        boss: {
            x: 915,
            y: canvas.height - 450,
            width: 50,
            height: 50,
            originalY: canvas.height - 450,
            dy: 0,
            health: 5
        },
        speedBoosts: [
            { x: 450, y: canvas.height - 240, width: 30, height: 30, collected: false }
        ]
    },
];

let currentLevelIndex = 0;
let currentLevel = levels[currentLevelIndex];

let goalReached = false;
let gameStarted = false;
let heroSpeechBubbleVisible = false;
let bossSpeechBubbleVisible = false;
let heroSpeechBubbleTimer;
let bossSpeechBubbleTimer;

document.getElementById('playButton').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('levelSelection').style.display = 'flex';
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
            if (!isMobile) {
                gameStarted = true;
                backgroundMusic.play();
                if (currentLevelIndex === 0 && currentLevel.boss && currentLevel.boss.intro) {
                    animateBossIntro(() => {
                        displayHeroSpeechBubble("Swallow your problems\nand comfort him...", 2000, gameLoop);
                    });
                } else {
                    gameLoop();
                }
            }
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
    mobileControls.style.display = 'none';
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
            drawSpeechBubble(ctx, boss.x - scrollOffset - 75, boss.y - 120, 220, 90, 10, "I am so sad and so alone,\nnobody is like me");
            bossSpeechBubbleTimer = setTimeout(() => {
                bossSpeechBubbleVisible = false;
                heroSpeechBubbleVisible = true;
                heroSpeechBubbleTimer = setTimeout(() => {
                    heroSpeechBubbleVisible = false;
                    startEndAnimation();
                }, 3000); // Display hero's speech bubble for 3 seconds
            }, 3000); // Wait 3 seconds before showing hero's thought bubble
        }
    }
}

function drawHeroSpeechBubble() {
    drawThoughtBubble(ctx, hero.x + 0, hero.y - 100, 260, 35, 10, "I should pity him again and stay...");
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
    ctx.font = '15px "Press Start 2P", cursive';
    ctx.fillText('Lives: ' + hero.lives, 10, 30);
}

function drawCoinsCollected() {
    ctx.fillStyle = 'black';
    ctx.font = '15px "Press Start 2P", cursive';
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

let animationActive = true; // Globale Variable, um den Animationsstatus zu verfolgen

function startEndAnimation() {
    if (!animationActive) return; // Animation überspringen, wenn sie deaktiviert ist

    let hero2 = { x: -50, y: canvas.height - 275, width: 37.5, height: 60, speed: 3, walkCounter: 0, images: hero2Images, currentImage: hero2Images.walk1, reachedPosition: false };
    let hero3 = { x: -100, y: canvas.height - 275, width: 37.5, height: 60, speed: 3, walkCounter: 0, images: hero3Images, currentImage: hero3Images.walk1, reachedPosition: false };
    let hero4 = { x: canvas.width + 50, y: canvas.height - 275, width: 37.5, height: 60, speed: 3, walkCounter: 0, images: hero4Images, currentImage: hero4Images.walk1, reachedPosition: false };
    let hero5 = { x: canvas.width + 100, y: canvas.height - 275, width: 37.5, height: 60, speed: 3, walkCounter: 0, images: hero5Images, currentImage: hero5Images.walk1, reachedPosition: false };
    let endAnimationStarted = false;
    let heroes = [hero2, hero3, hero4, hero5];
    let currentHeroIndex = 0;

    function drawWalkingHero(hero) {
        hero.walkCounter++;
        if (hero.walkCounter % 30 < 15) {
            hero.currentImage = hero.images.walk1;
        } else {
            hero.currentImage = hero.images.walk2;
        }
        ctx.drawImage(hero.currentImage, hero.x, hero.y, hero.width, hero.height);
    }

    function drawIdleHero(hero) {
        hero.currentImage = hero.images.idle;
        ctx.drawImage(hero.currentImage, hero.x, hero.y, hero.width, hero.height);
    }

    function animateHeroes() {
        if (!animationActive) return; // Animation überspringen, wenn sie deaktiviert ist

        clear();
        drawBackground();
        drawPlatforms();
        drawHero();
        drawBoss();
        drawEnemies();
        drawCoins();
        drawGoal();
        drawLives();
        drawCoinsCollected();
        drawSpeedBoosts();

        if (endAnimationStarted) {
            heroes.forEach((hero, index) => {
                if (index <= currentHeroIndex && !hero.reachedPosition) {
                    if (index <= 1 && hero.x < canvas.width / 2 - (2 - index) * 40) {
                        hero.x += hero.speed;
                        drawWalkingHero(hero);
                    } else if (index > 1 && hero.x > canvas.width / 2 + (index - 1) * 40) {
                        hero.x -= hero.speed;
                        drawWalkingHero(hero);
                    } else {
                        hero.reachedPosition = true;
                        drawIdleHero(hero);
                        if (index < heroes.length - 1) {
                            currentHeroIndex++;
                        }
                    }
                } else if (hero.reachedPosition) {
                    drawIdleHero(hero);
                }
            });
        }

        requestAnimationFrame(animateHeroes);
    }

    endAnimationStarted = true;
    animateHeroes();
}

// Funktion zum Aktivieren/Deaktivieren der Animation
function toggleAnimation() {
    animationActive = !animationActive;
    if (animationActive) {
        startEndAnimation();
    }
}

// Beispiel: Animation durch Tastendruck ein-/ausschalten
document.addEventListener('keydown', (e) => {
    if (e.key === 'a') { // 'a' Taste zum Ein-/Ausschalten der Animation
        toggleAnimation();
    }
});

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
            if (hero.lives <= 0) {
                setTimeout(resetToCharacterSelection, 1000);
                displayMessage("You Died!");
            } else {
                displayMessage("You Died!");
                setTimeout(resetHeroPosition, 1000);
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
        if (boss.y > boss.originalY + 10 || boss.y < boss.originalY - 10) {
            boss.dy *= -1;
        }

        if (hero.isAttacking && hero.x + hero.width > boss.x - scrollOffset - 50 &&
            hero.x < boss.x + boss.width - scrollOffset + 50 &&
            hero.y + hero.height > boss.y - 50 &&
            hero.y < boss.y + boss.height + 50) {
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
                setTimeout(resetToCharacterSelection, 1000);
            } else {
                displayMessage("Du bist gestorben!");
                setTimeout(resetHeroPosition, 1000);
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
    hero.y = canvas.height - 400;
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
        drawSpeechBubble(ctx, currentLevel.boss.x - scrollOffset - 145, currentLevel.boss.y - 85, 205, 35, 10, "Focus on your happiness!");
    }
    if (heroSpeechBubbleVisible) {
        drawHeroSpeechBubble();
    }
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
    }
});

updateFocusedButton(menus.startScreen);

resizeCanvas();
