const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: 50, y: 50, width: 20, height: 20, speed: 2, stealth: false };
let enemies = [];
let lights = [{ x: 200, y: 200, width: 150, height: 150 }];
let gameTime = 0;
let record = localStorage.getItem("record") || 0;
let noise = 0;
let gameOver = false;
let keys = {};

// Eventos de teclado
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function movePlayer() {
    let speed = player.stealth ? 1 : 2;

    if (keys["Shift"]) player.stealth = true;
    else player.stealth = false;

    if (keys["w"] || keys["ArrowUp"]) player.y -= speed;
    if (keys["s"] || keys["ArrowDown"]) player.y += speed;
    if (keys["a"] || keys["ArrowLeft"]) player.x -= speed;
    if (keys["d"] || keys["ArrowRight"]) player.x += speed;

    noise = player.stealth ? "Bajo" : "Alto";
}

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawLights() {
    lights.forEach(light => {
        ctx.fillStyle = "rgba(255,255,0,0.3)";
        ctx.fillRect(light.x, light.y, light.width, light.height);
    });
}

function checkLightCollision() {
    lights.forEach(light => {
        if (player.x < light.x + light.width &&
            player.x + player.width > light.x &&
            player.y < light.y + light.height &&
            player.y + player.height > light.y) {
            
            setTimeout(() => {
                if (!gameOver) endGame();
            }, 3000);
        }
    });
}

function spawnEnemies() {
    if (gameTime % 10 === 0) {
        enemies.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, width: 20, height: 20 });
    }
}

function moveEnemies() {
    enemies.forEach(enemy => {
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            enemy.x += dx / distance;
            enemy.y += dy / distance;
        }
    });
}

function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach(enemy => ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height));
}

function updateUI() {
    document.getElementById("time").innerText = gameTime;
    document.getElementById("record").innerText = record;
    document.getElementById("noiseLevel").innerText = noise;
}

function endGame() {
    gameOver = true;
    alert(`¡Perdiste! Aguantaste ${gameTime} segundos`);
    if (gameTime > record) {
        localStorage.setItem("record", gameTime);
    }
    location.reload();
}

function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        movePlayer();
        drawLights();
        drawPlayer();
        moveEnemies();
        drawEnemies();
        checkLightCollision();
        spawnEnemies();
        updateUI();
        
        gameTime++;
        setTimeout(gameLoop, 1000);
    }
}

gameLoop();

// Mostrar controles
document.getElementById("controls-btn").addEventListener("click", () => {
    let controls = document.getElementById("controls");
    controls.classList.toggle("hidden");
});
