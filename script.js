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
    document.getElementById('pantalla-1').classList.add('ocult
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
        this.size = 2; 
        this.ease = 0.1; 
        this.stopped = false;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
        if (this.stopped) return;

        let dx = this.destX - this.x;
        let dy = this.destY - this.y;
        
        this.x += dx * this.ease;
        this.y += dy * this.ease;

        // Si ya está muy cerca de su destino, se detiene para dar nitidez
        if (isForming && Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            this.x = this.destX;
            this.y = this.destY;
            this.stopped = true;
        }
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 8000; i++) particles.push(new Particle());
}

function formarTexto() {
    isForming = true;
    document.getElementById('pantalla-2').classList.add('oculto');
    
    ctx.clearRect(0, 0, width, height);
    
    // Ajuste de fuente para máxima claridad en móvil
    const fontSize = width < 500 ? 20 : 35;
    ctx.font = `bold ${fontSize}px 'Press Start 2P'`;
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    
    // Escribimos las líneas
    ctx.fillText("¿QUIERES", width / 2, height / 3);
    ctx.fillText("SER MI", width / 2, height / 3 + (fontSize + 20));
    ctx.fillText("SAN VALENTIN?", width / 2, height / 3 + (fontSize * 2 + 40));

    const data = ctx.getImageData(0, 0, width, height).data;
    let positions = [];
    
    // Escaneo pixel por pixel (Paso 1) para que no se pierda nada de la "M"
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            if (data[(y * width + x) * 4 + 3] > 128) {
                positions.push({ x, y });
            }
        }
    }

    // Mezcla aleatoria para que el efecto sea bonito
    positions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < particles.length; i++) {
        if (positions[i]) {
            particles[i].destX = positions[i].x;
            particles[i].destY = positions[i].y;
            particles[i].color = "#ff4d6d";
            particles[i].size = 2; // Tamaño uniforme
        } else {
            // El resto de puntos se va a los bordes
            particles[i].destX = Math.random() * width;
            particles[i].destY = height + 50; 
            particles[i].color = "transparent";
        }
    }

    setTimeout(() => {
        document.getElementById('contenedor-respuestas').classList.remove('oculto');
    }, 2000);
}

function finalizar(colorElegido) {
    document.getElementById('contenedor-respuestas').classList.add('oculto');
    document.getElementById('pantalla-final').classList.remove('oculto');
    particles.forEach(p => {
        p.stopped = false; // Permitir que se muevan de nuevo
        p.color = colorElegido === 'rojo' ? '#ff0000' : '#8b4513';
        p.destY += 30;
    });
}

function animate() {
    // Menos rastro para que las letras se vean limpias
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

