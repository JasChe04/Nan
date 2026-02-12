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
    if (isForming) formarTexto(); // Re-ajusta si se gira el celular
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
        this.ease = 0.12; // Más rápido para mayor nitidez
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
    // 4500 puntos aseguran que la palabra se vea rellena y nítida
    for (let i = 0; i < 4500; i++) particles.push(new Particle());
}

function formarTexto() {
    isForming = true;
    document.getElementById('pantalla-2').classList.add('oculto');
    
    ctx.clearRect(0, 0, width, height);
    const fontSize = width < 500 ? 22 : 35;
    ctx.font = `bold ${fontSize}px 'Press Start 2P'`;
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    
    const lineas = ["¿QUIERES", "SER M I", "SAN VALENTIN?"];
    lineas.forEach((linea, index) => {
        ctx.fillText(linea, width / 2, (height / 2.6) + (index * (fontSize + 18)));
    });

    const data = ctx.getImageData(0, 0, width, height).data;
    let positions = [];
    
    // Escaneo de alta precisión (cada 3 píxeles en lugar de 4)
    for (let y = 0; y < height; y += 3) {
        for (let x = 0; x < width; x += 3) {
            if (data[(y * width + x) * 4 + 3] > 128) {
                positions.push({ x, y });
            }
        }
    }

    // Mezclar posiciones para un efecto de vuelo más natural
    positions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < particles.length; i++) {
        if (positions[i]) {
            particles[i].destX = positions[i].x;
            particles[i].destY = positions[i].y;
            particles[i].color = "#ff4d6d";
            particles[i].size = 2;
        } else {
            // Puntos sobrantes se desvanecen en el fondo
            particles[i].destX = Math.random() * width;
            particles[i].destY = Math.random() * height;
            particles[i].color = "#1a0000";
            particles[i].size = 1;
        }
    }
}

function animate() {
    // Fondo negro con menos transparencia para evitar rastros borrosos
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);

}
