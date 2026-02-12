const canvas = document.getElementById('canvas-puntos');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let particles = [];
let width, height;
let isForming = false;
let claveIngresada = "";

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.height = height;
    canvas.width = width;
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
        this.size = 2.5; // Puntos más grandes para evitar huecos
        this.ease = 0.12; 
        this.stopped = false;
    }
    draw() {
        ctx.fillStyle = this.color;
        // Dibujamos rectángulos para un look pixel más sólido
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
        if (this.stopped) return;
        let dx = this.destX - this.x;
        let dy = this.destY - this.y;
        this.x += dx * this.ease;
        this.y += dy * this.ease;
        if (isForming && Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            this.x = this.destX;
            this.y = this.destY;
            this.stopped = true;
        }
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 10000; i++) particles.push(new Particle());
}

function formarTexto() {
    isForming = true;
    document.getElementById('pantalla-2').classList.add('oculto');
    
    ctx.clearRect(0, 0, width, height);
    
    // CALCULO DE TAMAÑO GIGANTE
    // Dividimos por el número de letras de la palabra más larga para que quepa justo
    const fontSizePrincipal = Math.floor(width / 9); 
    const fontSizeSub = Math.floor(width / 14); 
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    
    // Ajustamos la posición inicial más arriba
    const startY = height * 0.15;
    const spacing = fontSizePrincipal * 1.2;

    ctx.font = `bold ${fontSizePrincipal}px 'Press Start 2P'`;
    
    // Separamos en más líneas para que cada palabra sea GIGANTE
    ctx.fillText("¿QUIERES", width / 2, startY);
    ctx.fillText("SER", width / 2, startY + spacing);
    ctx.fillText("MI SAN", width / 2, startY + spacing * 2);
    ctx.fillText("VALENTIN?", width / 2, startY + spacing * 3);

    // Frase secundaria también grande
    ctx.font = `bold ${fontSizeSub}px 'Press Start 2P'`;
    ctx.fillStyle = "#ff758f";
    ctx.fillText("TE ASEGURO QUE", width / 2, startY + spacing * 4.2);
    ctx.fillText("VALDRA LA PENA", width / 2, startY + spacing * 4.2 + fontSizeSub * 1.5);

    const data = ctx.getImageData(0, 0, width, height).data;
    let positions = [];
    
    // Escaneo pixel a pixel (nitidez total)
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            if (data[(y * width + x) * 4 + 3] > 128) {
                positions.push({ x, y });
            }
        }
    }

    positions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < particles.length; i++) {
        if (positions[i]) {
            particles[i].destX = positions[i].x;
            particles[i].destY = positions[i].y;
            // Color según si es la pregunta o la promesa
            particles[i].color = positions[i].y > (startY + spacing * 3.5) ? "#ff758f" : "#ff4d6d";
            particles[i].stopped = false;
        } else {
            particles[i].destX = Math.random() * width;
            particles[i].destY = height + 100;
            particles[i].color = "transparent";
        }
    }

    setTimeout(() => {
        document.getElementById('contenedor-respuestas').classList.remove('oculto');
    }, 3000);
}

function finalizar(colorElegido) {
    document.getElementById('contenedor-respuestas').classList.add('oculto');
    document.getElementById('pantalla-final').classList.remove('oculto');
    particles.forEach(p => {
        p.stopped = false;
        p.color = colorElegido === 'rojo' ? '#ff0000' : '#8b4513';
        p.destY += 20;
    });
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
