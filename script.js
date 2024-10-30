let basketSpeed = 25;
let objectSpeed = 8;
//let jumpHeight = 190; // Altura del salto
let jumping = false; // Estado del salto
let vidas = 5; // Vidas totales del Personaje
let score = 0; // Inicializa el puntaje en 0
let movingRight = false;
let movingLeft = false;
let fallingObjectInterval;
let fallingObject2Interval; // Intervalo para el segundo objeto
let crab1Interval; // Intervalo para el cangrejo 1
let crab2Interval; // Intervalo para el cangrejo 2
let gamePaused = false; // Estado del juego

const basket = document.getElementById('basket');
const fallingObject = document.getElementById('falling-object');
const vidasRestantes = document.getElementById('vidas-restantes');
const pauseButton = document.getElementById('pause-button');


// Establecemos las rutas de las imágenes
const imageRight = 'derecha.png';
const imageLeft = 'izquierda.png';
const vidaImagen = 'vida.png';
const vidaPerdidaImagen = 'vida_perdida.png';
const crabImage1 = 'cangrejo_1.gif'; // Ruta para el cangrejo 1
const crabImage2 = 'cangrejo_2.gif'; // Ruta para el cangrejo 2



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
    if (e.key === 'ArrowUp' && !jumping) { // Si se presiona la flecha hacia arriba y no está saltando
        jump();
    }
});

// Evento para pausar y reanudar el juego
pauseButton.addEventListener('click', () => {
    if (gamePaused) {
        resumeGame();
    } else {
        pauseGame();
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

function jump() {
    if (gamePaused) return; // Si el juego está pausado, no se puede saltar

    jumping = true;
    let initialTop = basket.offsetTop; // Posición inicial del cesto

    // Subir
    let jumpUpInterval = setInterval(() => {
        if (basket.offsetTop > initialTop - jumpHeight) {
            basket.style.top = basket.offsetTop - 5 + 'px'; // Ajustar el valor para el salto
        } else {
            clearInterval(jumpUpInterval);
            // Bajar
            let jumpDownInterval = setInterval(() => {
                if (basket.offsetTop < initialTop) {
                    basket.style.top = basket.offsetTop + 5 + 'px'; // Volver a bajar
                } else {
                    clearInterval(jumpDownInterval);
                    jumping = false; // Termina el salto
                }
            }, 20);
        }
    }, 20);
}

function startFallingObject() {
    const objectSpeed = 5; // Ajustar la velocidad del objeto que cae
    fallingObjectInterval = setInterval(() => {
        if (gamePaused) return; // Si el juego está pausado, no hacer nada

        const objectTop = parseInt(window.getComputedStyle(fallingObject).getPropertyValue('top'));
        fallingObject.style.top = objectTop + objectSpeed + 'px';

        if (objectTop > window.innerHeight) {
            vidas--;
            updateLives();
            resetFallingObject();
        } else if (isColliding(basket, fallingObject)) {
            score++; // Incrementa el score al atrapar el objeto
            updateScore(); // Actualiza el display del score
            resetFallingObject(); // Reinicia la posición del objeto
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

// Función para pausar el juego
function pauseGame() {
    gamePaused = true;
    clearInterval(fallingObjectInterval);
    clearInterval(fallingObject2Interval); // Asegúrate de detener el objeto 2
    clearInterval(crab1Interval); // Detener cangrejo 1
    clearInterval(crab2Interval); // Detener cangrejo 2
    pauseButton.textContent = 'Reanudar'; // Cambiar texto del botón
}

// Función para reanudar el juego
function resumeGame() {
    gamePaused = false;
    startFallingObject(); // Reiniciar objeto que cae
    startFallingObject2(); // Reiniciar segundo objeto que cae
    startCrab1(); // Reiniciar cangrejo 1
    startCrab2(); // Reiniciar cangrejo 2
    pauseButton.textContent = 'Pausar'; // Cambiar texto del botón
}

// Función para reiniciar el objeto que cae
function resetFallingObject() {
    fallingObject.style.top = '0px';
    fallingObject.style.left = Math.random() *
    (window.innerWidth - fallingObject.width) + 'px';
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

// Función para actualizar el display del score
function updateScore() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.textContent = 'Score: ' + score; // Actualizar el texto del score
}

// Función para actualizar vidas
function updateLives() {
    vidasRestantes.textContent = 'Vidas restantes: ' + vidas;

    // Reiniciar todas las imágenes a vida.png
    for (let i = 0; i < vidasElements.length; i++) {
        vidasElements[i].src = vidaImagen; // Establecer todas las vidas a la imagen completa
    }

    // Cambiar imagen de vida a vida perdida
    if (vidas < 5) {
        vidasElements[4].src = vidaPerdidaImagen; // Vida 1
    }
    if (vidas < 4) {
        vidasElements[3].src = vidaPerdidaImagen; // Vida 2
    }
    if (vidas < 3) {
        vidasElements[2].src = vidaPerdidaImagen; // Vida 3
    }
    if (vidas < 2) {
        vidasElements[1].src = vidaPerdidaImagen; // Vida 4
    }
    if (vidas < 1) {
        vidasElements[0].src = vidaPerdidaImagen; // Vida 5
    }

    // Solo mostrar el panel de Game Over cuando las vidas sean 0
    if (vidas <= 0) {
        vidasElements[0].src = vidaPerdidaImagen; // Vida 6
        
        clearInterval(fallingObjectInterval);
        clearInterval(fallingObject2Interval); // Asegúrate de detener el objeto 2
        clearInterval(crab1Interval); // Detener cangrejo 1
        clearInterval(crab2Interval); // Detener cangrejo 2
        

        // Mostrar el panel de Game Over
        const gameOverPanel = document.getElementById('game-over-panel');
        gameOverPanel.style.display = 'flex'; // Muestra el panel
        gameOverPanel.style.position = 'absolute';
        gameOverPanel.style.top = '0';
        gameOverPanel.style.left = '0';
        gameOverPanel.style.width = '100%';
        gameOverPanel.style.height = '100%';
        gameOverPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Fondo semi-transparente
        gameOverPanel.style.color = 'white'; // Color del texto
        gameOverPanel.style.fontSize = '48px';
        gameOverPanel.style.zIndex = '10'; // Asegúrate de que esté en frente
    }
}

// Reiniciar juego (opcional)
document.getElementById('restart-button').addEventListener('click', resetGame);

// Función para reiniciar el juego
function resetGame() {
    score = 0; // Reiniciar score
    vidas = 5; // Reiniciar vidas
    fallingObject2Interval;
    updateLives(); // Actualiza la visualización de vidas
    updateScore(); // Reinicia y actualiza el display del score
    startFallingObject2(); // Reiniciar movimiento del objeto 2 que cae
    const gameOverPanel = document.getElementById('game-over-panel');
    gameOverPanel.style.display = 'none'; // Ocultar el panel de Game Over

    // Reinicia cualquier otra lógica del juego (posiciones, puntuaciones, etc.)
    startFallingObject(); // Reiniciar movimiento del objeto que cae
    startFallingObject2(); // Reiniciar movimiento del objeto 2 que cae
    startCrab1(); // Reinicia el movimiento del cangrejo 1
    startCrab2(); // Reinicia el movimiento del cangrejo 2
    startSeagull(); // Reinicia el movimiento de la gaviota

    // Reinicia otros elementos del juego según sea necesario
    resetGameElements(); // Por ejemplo, podrías tener una función que reinicie otros elementos
}

// Aquí podrías incluir la lógica para reiniciar otros elementos del juego
function resetGameElements() {
    // Reinicia las posiciones de otros elementos del juego, si es necesario
    // Por ejemplo, restablecer la posición del basket, etc.
}


// Iniciar el juego
startFallingObject(); // Llama a esta función para iniciar el movimiento del objeto que cae

// Crear el segundo objeto que restaura vidas
const object2 = document.createElement('img');
object2.src = 'mazapan.png'; // Ruta de la imagen del segundo objeto
object2.id = 'falling-object-2';
document.getElementById('game-container').appendChild(object2);

// Iniciar el objeto que cae al cargar el juego
startFallingObject();
setTimeout(() => {
   startFallingObject2();
}, 8000); // 8,000 ms = 8 segundos

// Estilo inicial del segundo objeto
object2.style.position = 'absolute';
object2.style.top = '0px';
object2.style.left = Math.random() * (window.innerWidth - object2.width) + 'px';
object2.style.width = '40px'; // Ajustar tamaño del objeto 2
object2.style.height = '40px';

// Función para iniciar el movimiento del segundo objeto
function startFallingObject2() {
    fallingObject2Interval = setInterval(() => {
        if (gamePaused) return; // Si el juego está pausado, no hacer nada

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
    if (vidas < 5) {
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

// Crear el cangrejo 1 que se mueve de izquierda a derecha
const crab1 = document.createElement('img');
crab1.src = crabImage1; // Ruta de la imagen del cangrejo 1
crab1.id = 'cangrejo-1';
document.getElementById('game-container').appendChild(crab1);

// Estilo inicial del cangrejo 1
crab1.style.position = 'absolute';
crab1.style.top = (basket.offsetTop + 60) + 'px'; // Ajustar altura
crab1.style.left = '0px'; // Sale desde la esquina izquierda
crab1.style.width = '40px'; // Ajustar tamaño del cangrejo 1
crab1.style.height = '40px';

// Función para iniciar el movimiento del cangrejo 1
function startCrab1() {
    crab1Interval = setInterval(() => {
        if (gamePaused) return; // Si el juego está pausado, no hacer nada

        const crab1Left = parseInt(window.getComputedStyle(crab1).getPropertyValue('left'));
        if (crab1Left < window.innerWidth - crab1.width) {
            crab1.style.left = crab1Left + 5 + 'px'; // Mover a la derecha
        } else {
            resetCrab1();
        }

        // Verificar colisiones
        if (isColliding(basket, crab1)) {
            vidas--; // Restar vida al colisionar
            updateLives();
            resetCrab1();
        }
    }, 100);
}

// Función para reiniciar el cangrejo 1
function resetCrab1() {
    crab1.style.left = '0px'; // Regresar a la esquina izquierda
    crab1.style.top = (basket.offsetTop + 60) + 'px'; // Mantener a la altura deseada
}

// Crear el cangrejo 2 que se mueve de derecha a izquierda
const crab2 = document.createElement('img');
crab2.src = crabImage2; // Ruta de la imagen del cangrejo 2
crab2.id = 'cangrejo-2';
document.getElementById('game-container').appendChild(crab2);

// Estilo inicial del cangrejo 2
crab2.style.position = 'absolute';
crab2.style.top = (basket.offsetTop + 60) + 'px'; // Ajustar altura
crab2.style.right = '0px'; // Sale desde la esquina derecha
crab2.style.width = '40px'; // Ajustar tamaño del cangrejo 2
crab2.style.height = '40px';

// Función para iniciar el movimiento del cangrejo 2
function startCrab2() {
    crab2Interval = setInterval(() => {
        if (gamePaused) return; // Si el juego está pausado, no hacer nada

        const crab2Left = parseInt(window.getComputedStyle(crab2).getPropertyValue('left'));
        if (crab2Left > 0) {
            crab2.style.left = crab2Left - 5 + 'px'; // Mover a la izquierda
        } else {
            resetCrab2();
        }

        // Verificar colisiones
        if (isColliding(basket, crab2)) {
            vidas--; // Restar vida al colisionar
            updateLives();
            resetCrab2();
        }
    }, 100);
}

// Función para reiniciar el cangrejo 2
function resetCrab2() {
    crab2.style.left = (window.innerWidth - crab2.width) + 'px'; // Regresar a la esquina derecha
    crab2.style.top = (basket.offsetTop + 60) + 'px'; // Mantener a la altura deseada
}

// Iniciar las funciones de los objetos al cargar el juego
startFallingObject();
startFallingObject2();
startCrab1();
startCrab2();

// Al final del archivo script.js
const seagull = document.createElement('img');
seagull.src = 'gaviota.gif';
seagull.alt = 'Gaviota';
seagull.id = 'seagull';
seagull.style.position = 'absolute';
seagull.style.width = '80px';
seagull.style.height = '80px';
document.getElementById('game-container').appendChild(seagull);

// Función para iniciar el movimiento de la gaviota
function startSeagull() {
    seagull.style.left = '0px'; // Inicia desde la parte izquierda de la pantalla
    seagull.style.top = Math.random() * (window.innerHeight - seagull.height) + 'px'; // Altura aleatoria inicial
    
    const seagullSpeed = 8; // Velocidad de la gaviota
    let direction = 1; // 1 para bajar, -1 para subir
    const seagullInterval = setInterval(() => {
        if (gamePaused) return; // Pausa el movimiento si el juego está en pausa

        const seagullLeft = parseInt(window.getComputedStyle(seagull).getPropertyValue('left'));
        
        // Ajustar la altura de la gaviota para simular el movimiento de siseo
        if (seagull.style.top < basket.offsetTop) {
            direction = 1; // Si está por encima del cesto, bajar
        } else if (seagull.style.top > basket.offsetTop + 10) {
            direction = -1; // Si está por debajo del cesto, subir
        }

        seagull.style.top = parseInt(seagull.style.top) + (2 * direction) + 'px'; // Mover hacia arriba o abajo

        seagull.style.left = seagullLeft + seagullSpeed + 'px'; // Mover hacia la derecha

        // Reiniciar la gaviota si sale de la pantalla
        if (seagullLeft > window.innerWidth) {
            clearInterval(seagullInterval); // Detener el movimiento
            resetSeagull(); // Reiniciar posición de la gaviota
        }

        // Verificar colisiones con el cesto
        if (isColliding(basket, seagull)) {
            vidas--; // Restar vida si colisiona con el cesto
            updateLives();
            resetSeagull(); // Reiniciar posición de la gaviota
        }
    }, 50);
}

function resetSeagull() {
    seagull.style.top = '-80px'; // Reiniciar a una posición fuera de la pantalla
    seagull.style.left = Math.random() * (window.innerWidth - seagull.width) + 'px'; // Posición aleatoria
}

// Iniciar la gaviota cada 5 segundos de forma aleatoria
setInterval(() => {
    if (!gamePaused) startSeagull();
}, 5000);

// Variables para el cesto y los controles
//const basket = document.getElementById('basket');
const btnLeft = document.getElementById('btn-left');
const btnJump = document.getElementById('btn-jump');
const btnRight = document.getElementById('btn-right');

// Parámetros de movimiento
const step = 20; // Cantidad de píxeles por movimiento
const jumpHeight = 190; // Altura máxima del salto
//let jumping = false; // Estado del salto

// Función para mover el cesto a la izquierda
function moveLeft() {
    if (basket.offsetLeft > 0) {
        basket.style.left = basket.offsetLeft - 10 + 'px'; // Ajustar el valor según tu necesidad
    }
}

// Función para mover el cesto a la derecha
function moveRight() {
    if (basket.offsetLeft < gameContainer.clientWidth - basket.clientWidth) {
        basket.style.left = basket.offsetLeft + 10 + 'px'; // Ajustar el valor según tu necesidad
    }
}

// Función de salto
function jump() {
    if (jumping) return; // Si ya está saltando, no hacer nada
    jumping = true; // Cambia el estado a saltando
    let initialTop = basket.offsetTop; // Posición inicial del cesto

    // Subir
    let jumpUpInterval = setInterval(() => {
        if (basket.offsetTop > initialTop - jumpHeight) {
            basket.style.top = basket.offsetTop - 5 + 'px'; // Ajustar el valor para el salto
        } else {
            clearInterval(jumpUpInterval); // Detener el intervalo de subida

            // Bajar
            let jumpDownInterval = setInterval(() => {
                if (basket.offsetTop < initialTop) {
                    basket.style.top = basket.offsetTop + 5 + 'px'; // Volver a bajar
                } else {
                    clearInterval(jumpDownInterval); // Detener el intervalo de bajada
                    basket.style.top = initialTop + 'px'; // Asegurarse de que esté en la posición original
                    jumping = false; // Termina el salto
                }
            }, 20);
        }
    }, 20);
}

// Evento para mover hacia la izquierda
btnLeft.addEventListener('click', () => {
    const currentLeft = parseInt(window.getComputedStyle(basket).left);
    if (currentLeft > 0) {
        basket.style.left = `${currentLeft - step}px`;
    }
});

// Evento para mover hacia la derecha
btnRight.addEventListener('click', () => {
    const currentLeft = parseInt(window.getComputedStyle(basket).left);
    const containerWidth = document.getElementById('game-container').offsetWidth;
    const basketWidth = basket.offsetWidth;

    if (currentLeft + basketWidth < containerWidth) {
        basket.style.left = `${currentLeft + step}px`;
    }
});

// Evento para hacer un salto fluido al presionar el botón táctil
btnJump.addEventListener('click', jump);

