const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');

let heroImage = new Image();
let backgroundImage = new Image();
backgroundImage.src = 'assets/background.png';

let hero = {
    x: 50,
    y: canvas.height - 200,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    jumping: false
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
        goal: { x: 950, y: canvas.height - 410, width: 50, height: 50 }
    },
    {
        platforms: [
            { x: 0, y: canvas.height - 115, width: 1200, height: 20, visible: false },
            { x: 100, y: canvas.height - 170, width: 100, height: 10, visible: true },
            { x: 300, y: canvas.height - 270, width: 100, height: 10, visible: true },
            { x: 500, y: canvas.height - 200, width: 60, height: 10, visible: true },
            { x: 700, y: canvas.height - 250, width: 60, height: 10, visible: true },
            { x: 900, y: canvas.height - 220, width: 60, height: 10, visible: true },
            { x: 1100, y: canvas.height - 160, width: 60, height: 10, visible: true }
        ],
        goal: { x: 1150, y: canvas.height - 350, width: 50, height: 50 }
    },
    {
        platforms: [
            { x: 0, y: canvas.height - 115, width: 1400, height: 20, visible: false },
            { x: 150, y: canvas.height - 170, width: 100, height: 10, visible: true },
            { x: 350, y: canvas.height - 120, width: 100, height: 10, visible: true },
            { x: 550, y: canvas.height - 200, width: 60, height: 10, visible: true },
            { x: 750, y: canvas.height - 180, width: 60, height: 10, visible: true },
            { x: 950, y: canvas.height - 260, width: 60, height: 10, visible: true },
            { x: 1150, y: canvas.height - 340, width: 60, height: 10, visible: true },
            { x: 1250, y: canvas.height - 300, width: 60, height: 10, visible: true }
        ],
        goal: { x: 1350, y: canvas.height - 350, width: 50, height: 50 }
    },
    {
        platforms: [
            { x: 0, y: canvas.height - 115, width: 1600, height: 20, visible: false },
            { x: 100, y: canvas.height - 170, width: 100, height: 10, visible: true },
            { x: 300, y: canvas.height - 220, width: 100, height: 10, visible: true },
            { x: 500, y: canvas.height - 300, width: 60, height: 10, visible: true },
            { x: 700, y: canvas.height - 350, width: 60, height: 10, visible: true },
            { x: 900, y: canvas.height - 220, width: 60, height: 10, visible: true },
            { x: 1100, y: canvas.height - 300, width: 60, height: 10, visible: true },
            { x: 1300, y: canvas.height - 380, width: 60, height: 10, visible: true },
            { x: 1500, y: canvas.height - 360, width: 60, height: 10, visible: true }
        ],
        goal: { x: 1550, y: canvas.height - 420, width: 50, height: 50 }
    }
];

let currentLevelIndex = 0;
let currentLevel = levels[currentLevelIndex];

let goalReached = false;
let gameStarted = false;

document.getElementById('characterSelection').addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        let selectedCharacter = e.target.getAttribute('data-character');
        heroImage.src = 'assets/' + selectedCharacter;
        heroImage.onload = () => {  // Warte, bis das Bild geladen ist
            console.log("Hero image loaded successfully.");
            document.getElementById('characterSelection').style.display = 'none';
            gameStarted = true;
            backgroundMusic.play(); // Hintergrundmusik abspielen
            gameLoop();
        };
        heroImage.onerror = () => {  // Fehlerbehandlung, falls das Bild nicht geladen werden kann
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

    // Hintergrundbilder wiederholen
    const repeatCount = Math.ceil((scrollOffset + canvas.width) / backgroundWidth);

    for (let i = 0; i <= repeatCount; i++) {
        ctx.drawImage(backgroundImage, i * backgroundWidth - scrollOffset % backgroundWidth, 0, backgroundWidth, backgroundHeight);
    }
}

function drawPlatforms() {
    currentLevel.platforms.forEach(platform => {
        if (platform.visible) {
            ctx.fillStyle = '#070439'; // Farbe für sichtbare Plattformen
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Farbe für unsichtbare Plattformen
        }
        ctx.fillRect(platform.x - scrollOffset, platform.y, platform.width, platform.height);
    });
}

function drawGoal() {
    let goal = currentLevel.goal;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(goal.x - scrollOffset, goal.y, goal.width, goal.height);
    ctx.fillStyle = 'black'; // Textfarbe
    ctx.font = '20px Arial'; // Textfont und Größe
    ctx.fillText('Goal!', goal.x - scrollOffset + 5, goal.y + 30); // Positioniere den Text innerhalb des Zielkastens
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
        if (hero.y + hero.height > platform.y &&    // Hero is falling onto the platform
            hero.y + hero.height - hero.dy <= platform.y &&    // Check previous position above the platform
            hero.x + hero.width > platform.x - scrollOffset &&
            hero.x < platform.x + platform.width - scrollOffset) {
            hero.dy = 0;
            hero.jumping = false;
            hero.y = platform.y - hero.height;
        }
    });

    let goal = currentLevel.goal;
    if (hero.x + hero.width > goal.x - scrollOffset &&
        hero.x < goal.x + goal.width - scrollOffset &&
        hero.y + hero.height > goal.y &&
        hero.y < goal.y + goal.height) {
        goalReached = true;
    }

    // Scroll-Logik
    if (hero.x > canvas.width / 2 && hero.dx > 0) {
        scrollOffset += hero.dx;
        hero.x = canvas.width / 2;
    } else if (scrollOffset > 0 && hero.dx < 0) {
        scrollOffset += hero.dx;
        hero.x = canvas.width / 2;
    }

    // Verhindere das Zurückscrollen über den Anfang des Levels hinaus
    if (scrollOffset < 0) {
        scrollOffset = 0;
        hero.x += hero.dx;
    }
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
        currentLevelIndex = 0; // Zurück zum ersten Level oder Spiel beenden
    }
    currentLevel = levels[currentLevelIndex];
    hero.x = 50;
    hero.y = canvas.height - 200;
    hero.dx = 0;
    hero.dy = 0;
    scrollOffset = 0; // Scroll-Offset zurücksetzen
    goalReached = false;
    gameLoop();
}

function gameLoop() {
    if (!gameStarted) return;  // Verhindert, dass das Spiel läuft, bevor es gestartet wird
    clear();
    drawBackground();
    drawHero();
    drawPlatforms();
    drawGoal();
    update();

    if (goalReached) {
        displayMessage("You Win!");
        backgroundMusic.pause(); // Hintergrundmusik stoppen, wenn das Ziel erreicht ist
        setTimeout(nextLevel, 2000); // Nach 2 Sekunden zum nächsten Level wechseln
    } else {
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', moveHero);
document.addEventListener('keyup', stopHero);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') jump();
});
