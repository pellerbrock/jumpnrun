const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let heroImage = new Image();
let backgroundImage = new Image();
backgroundImage.src = 'assets/background.png'; // Hintergrundbild

let hero = {
    x: 50,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    jumping: false
};

let platforms = [
    { x: 0, y: canvas.height - 100, width: 100, height: 20 },
    { x: 350, y: canvas.height - 200, width: 100, height: 20 }
];

let goal = {
    x: canvas.width - 100,
    y: canvas.height - 150,
    width: 50,
    height: 50
};

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
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawPlatforms() {
    platforms.forEach((platform, index) => {
        if (index === 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        } else if (index === 1) {
            ctx.fillStyle = '#ADD8E6';
        } else {
            ctx.fillStyle = '#654321';
        }
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawGoal() {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
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

    platforms.forEach(platform => {
        if (hero.y + hero.height >= platform.y &&
            hero.y + hero.height <= platform.y + platform.height &&
            hero.x + hero.width > platform.x &&
            hero.x < platform.x + platform.width) {
            hero.dy = 0;
            hero.jumping = false;
            hero.y = platform.y - hero.height;
        }
    });

    if (hero.x + hero.width > goal.x &&
        hero.x < goal.x + goal.width &&
        hero.y + hero.height > goal.y &&
        hero.y < goal.y + goal.height) {
        goalReached = true;
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
    } else {
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', moveHero);
document.addEventListener('keyup', stopHero);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') jump();
});
