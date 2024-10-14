let basketSpeed = 15;
let objectSpeed = 10;
let vidas = 3;
let movingRight = false;
let movingLeft = false;
let fallingObjectInterval;

const basket = document.getElementById('basket');
const fallingObject = document.getElementById('falling-object');
const vidasRestantes = document.getElementById('vidas-restantes');
const pauseButton = document.getElementById('pause-button');

// Establecemos las rutas de las imágenes
const imageRight = 'imagenes/derecha.png';
const imageLeft = 'imagenes/izquierda.png';
const vidaImagen = 'imagenes/vida.png';
const vidaPerdidaImagen = 'imagenes/vida_perdida.png';

// Inicializar las imágenes de vidas
const vidasElements = document.querySelectorAll('.life');
vidasElements.forEach((vida) => {
    vida.src = vidaImagen; // Asignar la imagen de vida
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        movingRight = true;
        basket.src = imageRight; // Cambiar la imagen a derecha
    }
    if (e.key === 'ArrowLeft') {
        movingLeft = true;
        basket.src = imageLeft; // Cambiar la imagen a izquierda
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') {
        movingRight = false;
    }
    if (e.key === 'ArrowLeft') {
        movingLeft = false;
    }
});

function startFallingObject() {
    fallingObjectInterval = setInterval(() => {
        const objectTop = parseInt(window.getComputedStyle(fallingObject).getPropertyValue('top'));
        fallingObject.style.top = objectTop + objectSpeed + 'px';

        if (objectTop > window.innerHeight) {
            vidas--;
            updateLives();
            resetFallingObject();
        } else if (isColliding(basket, fallingObject)) {
            resetFallingObject();
        }

        // Movimiento del cesto
        if (movingRight && basket.offsetLeft + basketSpeed <= window.innerWidth - basket.width) {
            basket.style.left = basket.offsetLeft + basketSpeed + 'px';
        }
        if (movingLeft && basket.offsetLeft - basketSpeed >= 0) {
            basket.style.left = basket.offsetLeft - basketSpeed + 'px';
        }
    }, 100); // Se ejecuta cada 100ms
}

// Función para reiniciar el objeto que cae
function resetFallingObject() {
    fallingObject.style.top = '0px';
    fallingObject.style.left = Math.random() * (window.innerWidth - fallingObject.width) + 'px';
}

// Función para verificar colisiones
function isColliding(basket, fallingObject) {
    const basketRect = basket.getBoundingClientRect();
    const objectRect = fallingObject.getBoundingClientRect();
    return !(
        basketRect.top > objectRect.bottom ||
        basketRect.bottom < objectRect.top ||
        basketRect.right < objectRect.left ||
        basketRect.left > objectRect.right
    );
}

// Función para actualizar vidas
function updateLives() {
    vidasRestantes.textContent = 'Vidas restantes: ' + vidas;

    // Cambiar imagen de vida a vida perdida
    if (vidas < 3) {
        vidasElements[2].src = vidaPerdidaImagen; // Vida 1
    }
    if (vidas < 2) {
        vidasElements[1].src = vidaPerdidaImagen; // Vida 2
    }
    if (vidas < 1) {
        vidasElements[0].src = vidaPerdidaImagen; // Vida 3
    }
    if (vidas <= 0) {
        clearInterval(fallingObjectInterval);
        alert('Game Over');
    }
}

// Crear el segundo objeto que restaura vidas
const object2 = document.createElement('img');
object2.src = 'imagenes/Aguacate.png'; // Ruta de la imagen del segundo objeto
object2.id = 'falling-object-2';
document.getElementById('game-container').appendChild(object2);

// Estilo inicial del segundo objeto
object2.style.position = 'absolute';
object2.style.top = '0px';
object2.style.left = Math.random() * (window.innerWidth - object2.width) + 'px';
object2.style.width = '50px'; // Ajustar tamaño del objeto 2
object2.style.height = '50px';

// Función para iniciar el movimiento del segundo objeto
function startFallingObject2() {
    setInterval(() => {
        const object2Top = parseInt(window.getComputedStyle(object2).getPropertyValue('top'));
        object2.style.top = object2Top + (objectSpeed - 2) + 'px'; // Velocidad ligeramente menor

        // Movimiento lateral aleatorio
        let randomDirection = Math.random() < 0.5 ? -5 : 5;
        let newLeft = object2.offsetLeft + randomDirection;
        if (newLeft >= 0 && newLeft <= window.innerWidth - object2.width) {
            object2.style.left = newLeft + 'px';
        }

        if (object2Top > window.innerHeight) {
            resetFallingObject2();
        } else if (isColliding(basket, object2)) {
            restoreLife(); // Restaurar una vida al colisionar
            resetFallingObject2();
        }
    }, 100);
}

// Función para restaurar la vida
function restoreLife() {
    if (vidas < 3) {
        vidas++;
        vidasRestantes.textContent = 'Vidas restantes: ' + vidas;
        vidasElements[vidas - 1].src = vidaImagen; // Restaurar imagen de vida
    }
}

// Función para reiniciar el segundo objeto
function resetFallingObject2() {
    object2.style.top = '0px';
    object2.style.left = Math.random() * (window.innerWidth - object2.width) + 'px';
}

// Iniciar el objeto que cae al cargar el juego
startFallingObject();
setTimeout(() => {
    startFallingObject2();
}, 10000); // 10,000 ms = 10 segundos

// Manejo del botón de pausa
pauseButton.addEventListener('click', () => {
    if (fallingObjectInterval) {
        clearInterval(fallingObjectInterval);
        //clearInterval(fallingObject2Interval); // Detener también el objeto 2
        fallingObjectInterval = null;
        //fallingObject2Interval = null; // Asegúrate de que no se reinicie
        pauseButton.textContent = 'Reanudar';
    } else {
        startFallingObject();
        //startFallingObject2(); // Reiniciar también el objeto 2
        pauseButton.textContent = 'Pausar';
    }
});

