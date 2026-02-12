const canvas = document.getElementById('canvas-puntos');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let particles = [];
let width, height;
let isForming = false;
let claveIngresada = "";

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

function irAClave() {
    document.getElementById('pantalla-1').classList.add('oculto');
    document.getElementById('pantalla-clave').classList.remove('oculto');
}

function presionarNumero(num) {
    if (claveIngresada.length < 2) {
        claveIngresada += num;
        document.getElementById('display-clave').innerText = claveIngresada;
    }
    if (claveIngresada === "79") {
        setTimeout(irACorazon, 400);
    } else if (claveIngresada.length === 2) {
        setTimeout(borrarClave, 500);
    }
}

function borrarClave() {
    claveIngresada = "";
    document.getElementById('display-clave').innerText = "--";
}

function irACorazon() {
    document.getElementById('pantalla-clave').classList.add('oculto');
    document.getElementById('pantalla-2').classList.remove('oculto');
    initParticles();
    animate();
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.destX = this.x;
        this.destY = this.y;
        this.color = '#ff758f';
        this.size = 1.8;
        this.ease = 0.15; // Un poco más rápido para que se sienta firme
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
        this.x += (this.destX - this.x) * this.ease;
        this.y += (this.destY - this.y) * this.ease;
    }
}

function initParticles() {
    particles = [];
    // Aumentamos a 6000 puntos para que "MI" se rellene por completo
    for (let i = 0; i < 6000; i++) particles.push(new Particle());
}

function formarTexto() {
    isForming = true;
    document.getElementById('pantalla-2').classList.add('oculto');
    
    ctx.clearRect(0, 0, width, height);
    
    // Tamaños diferenciados para que el MI sea grande y nítido
    const sizeGrande = width < 500 ? 24 : 35;
    const sizeMI = width < 500 ? 32 : 45; // El "MI" será más grande para capturar más puntos
    
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    
    // Dibujamos las líneas con diferentes tamaños
    ctx.font = `bold ${sizeGrande}px 'Press Start 2P'`;
    ctx.fillText("¿QUIERES", width / 2, height / 2.8);
    
    ctx.font = `bold ${sizeMI}px 'Press Start 2P'`;
    ctx.fillText("SER MI", width / 2, height / 2.8 + (sizeGrande + 25));
    
    ctx.font = `bold ${sizeGrande}px 'Press Start 2P'`;
    ctx.fillText("VALENTIN?", width / 2, height / 2.8 + (sizeGrande + sizeMI + 40));

    // ESCANEO DE ALTA DEFINICIÓN (Paso 2: revisa casi cada pixel)
    const data = ctx.getImageData(0, 0, width, height).data;
    let positions = [];
    for (let y = 0; y < height; y += 2) { 
        for (let x = 0; x < width; x += 2) {
            if (data[(y * width + x) * 4 + 3] > 128) {
                positions.push({ x, y });
            }
        }
    }

    // Mezclamos posiciones para el efecto visual
    positions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < particles.length; i++) {
        if (positions[i]) {
            particles[i].destX = positions[i].x;
            particles[i].destY = positions[i].y;
            particles[i].color = "#ff4d6d";
            particles[i].size = 2.2; // Puntos ligeramente más grandes para nitidez
        } else {
            particles[i].destX = Math.random() * width;
            particles[i].destY = Math.random() * height;
            particles[i].color = "#150000";
            particles[i].size = 1;
        }
    }

    setTimeout(() => {
        document.getElementById('contenedor-respuestas').classList.remove('oculto');
    }, 1800);
}

function finalizar(colorElegido) {
    document.getElementById('contenedor-respuestas').classList.add('oculto');
    document.getElementById('pantalla-final').classList.remove('oculto');
    particles.forEach(p => {
        p.color = colorElegido === 'rojo' ? '#ff0000' : '#8b4513';
        p.destY += 40;
    });
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
