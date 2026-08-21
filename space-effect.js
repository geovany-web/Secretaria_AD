const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Estrelas
const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    alpha: Math.random(),
    speed: Math.random() * 0.02
}));

// Meteoros
const meteors = [];

function createMeteor() {
    meteors.push({
        x: Math.random() * canvas.width + 200,
        y: Math.random() * -100,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 10 + 6,
        alpha: 1
    });
}

// Gera um meteoro a cada 1.5 a 3 segundos
setInterval(createMeteor, Math.random() * 1500 + 1500);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar Estrelas
    stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Desenhar Meteoros
    meteors.forEach((m, index) => {
        const gradient = ctx.createLinearGradient(m.x, m.y, m.x - m.length, m.y + m.length);
        gradient.addColorStop(0, 'rgba(236, 72, 153, 1)');
        gradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.length, m.y + m.length);
        ctx.stroke();

        m.x -= m.speed;
        m.y += m.speed;
        m.alpha -= 0.01;

        if (m.y > canvas.height || m.x < 0) {
            meteors.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

animate();
