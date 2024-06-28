const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let heroImage = new Image();
heroImage.src = 'assets/hero.png';

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

// Plattform-Daten
let platform = {
    x: 200,
    y: canvas.height - 150,
    width: 100,
    height: 20
};

function drawHero() {
    ctx.drawImage(heroImage, hero.x, hero.y, hero.width, hero.height);
}

function drawPlatform() {
    ctx.fillStyle = '#654321'; // Braune Farbe für die Plattform
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    hero.x += hero.dx;
    hero.y += hero.dy;

    // Gravitations- und Boden-Kollisionsprüfung
    if (hero.y + hero.height < canvas.height) {
        hero.dy += 1; // Gravitationskraft
    } else {
        hero.dy = 0;
        hero.jumping = false;
    }

    // Plattform-Kollisionsprüfung
    if (hero.y + hero.height >= platform.y &&
        hero.y + hero.height <= platform.y + platform.height &&
        hero.x + hero.width > platform.x &&
        hero.x < platform.x + platform.width) {
        hero.dy = 0;
        hero.jumping = false;
        hero.y = platform.y - hero.height; // Auf die Plattform setzen
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
        hero.dy = -15; // Sprunghöhe
        hero.jumping = true;
    }
}

function gameLoop() {
    clear();
    drawHero();
    drawPlatform(); // Plattform zeichnen
    update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', moveHero);
document.addEventListener('keyup', stopHero);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') jump();
});

gameLoop();
