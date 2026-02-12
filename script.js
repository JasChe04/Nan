const canvas = document.getElementById('canvas-puntos');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let particles = [];
let width, height;
let isForming = false;
let claveIngresada = "";

// Ajuste especial para pantallas Retina (iPhone 14)
function resize() {
    const scale = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    
    // Multiplicamos el canvas por la escala del iPhone para nitidez absoluta
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);
    
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
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
        this.size = 2.8; // Aumentamos el tamaño del punto para que sea más legible
        this.ease = 0.12; 
        this.stopped = false;
    }
    draw() {
        ctx.fillStyle = this.color;
        // Dibujamos rectángulos para un look pixel sólido y nítido
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
    // 12,000 partículas para rellenar letras masivas
    for (let i = 0; i < 12000; i++) particles.push(new Particle());
}

function formarTexto() {
    isForming = true;
    document.getElementById('pantalla-2').classList.add('oculto');
    
    ctx.clearRect(0, 0, width, height);
    
    // TAMAÑO MASIVO PARA IPHONE 14
    // Usamos el ancho disponible para que la palabra más larga ocupe el 85% del ancho
    const fontSizePrincipal = Math.floor(width * 0.11); 
    const fontSizeSub = Math.floor(width * 0.05); 
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    
    // Posicionamiento para iPhone (pantalla alargada)
    const startY = height * 0.12;
    const spacing = fontSizePrincipal * 1.3;

    ctx.font = `bold ${fontSizePrincipal}px 'Press Start 2P'`;
    
    // Dividimos en líneas cortas para poder agrandar la letra al máximo
    ctx.fillText("¿QUIERES", width / 2, startY);
    ctx.fillText("SER", width / 2, startY + spacing);
    ctx.fillText("MI SAN", width / 2, startY + spacing * 2);
    ctx.fillText("VALENTIN?", width / 2, startY + spacing * 3.1);

    // Frase secundaria en 2 líneas también grande
    ctx.font = `bold ${fontSizeSub}px 'Press Start 2P'`;
    ctx.fillStyle = "#ff758f";
    const subStartY = startY + spacing * 4.5;
    ctx.fillText("TE ASEGURO QUE", width / 2, subStartY);
    ctx.fillText("VALDRA LA PENA", width / 2, subStartY + fontSizeSub * 1.8);

    const data = ctx.getImageData(0, 0, width * (window.devicePixelRatio || 1), height * (window.devicePixelRatio || 1)).data;
    let positions = [];
    
    const dpr = window.devicePixelRatio || 1;
    // Escaneo optimizado para iPhone
    for (let y = 0; y < height * dpr; y += 2 * dpr) {
        for (let x = 0; x < width * dpr; x += 2 * dpr) {
            const index = (y * width * dpr + x) * 4;
            if (data[index + 3] > 128) {
                positions.push({ x: x / dpr, y: y / dpr });
            }
        }
    }

    positions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < particles.length; i++) {
        if (positions[i]) {
            particles[i].destX = positions[i].x;
            particles[i].destY = positions[i].y;
            particles[i].color = positions[i].y > subStartY - 20 ? "#ff758f" : "#ff4d6d";
            particles[i].stopped = false;
        } else {
            particles[i].destX = Math.random() * width;
            particles[i].destY = height + 100;
            particles[i].color = "transparent";
        }
    }

    setTimeout(() => {
        document.getElementById('contenedor-respuestas').classList.remove('oculto');
    }, 3500);
}

function finalizar(colorElegido) {
    document.getElementById('contenedor-respuestas').classList.add('oculto');
    document.getElementById('pantalla-final').classList.remove('oculto');
    particles.forEach(p => {
        p.stopped = false;
        p.color = colorElegido === 'rojo' ? '#ff0000' : '#8b4513';
        p.destY += 25;
    });
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
