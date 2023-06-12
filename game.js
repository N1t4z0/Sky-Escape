// Obtener el elemento canvas del HTML
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const carpinchoImage = new Image();
carpinchoImage.src = 'carpincho.png';

// Definir las propiedades del personaje
const player = {
  x: 50,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  carpinchoImage: carpinchoImage,
  velocityY: 0, // Velocidad en el eje y
  jumpStrength: 12, // Fuerza del salto (ajustar según preferencia)
  fastFallVelocity: 5,
  isJumping: false // Variable para controlar el salto
};

// Definir las propiedades de las estructuras
const structureWidth = player.width * 4; // Ancho de las estructuras (4 veces el ancho del personaje)
const minStructureHeight = player.height * 2; // Altura mínima de las estructuras (2 veces la altura del personaje)
const maxStructureHeight = canvas.height - player.height * 5; // Altura máxima de las estructuras (5 veces la altura del personaje)
const structureGap = player.width * 4; // Separación entre estructuras (4 veces el ancho del personaje)
const structureMargin = player.width * 4; // Margen entre estructuras (4 veces el ancho del personaje)
const structures = []; // Arreglo para almacenar las estructuras generadas

// Función para generar una estructura aleatoria
function generateStructure() {
  const structureHeight = Math.random() * (maxStructureHeight - minStructureHeight) + minStructureHeight;
  const structureGapPosition = Math.random() * (canvas.height - structureHeight - structureMargin * 2) + structureMargin;
  const structure = {
    x: canvas.width,
    y: 0,
    width: structureWidth,
    height: structureGapPosition
  };
  structures.push(structure);

  const structure2 = {
    x: canvas.width,
    y: structureGapPosition + structureHeight,
    width: structureWidth,
    height: canvas.height - structureGapPosition - structureHeight
  };
  structures.push(structure2);
}

// Función para dibujar el personaje en el canvas
function drawPlayer() {
  context.fillStyle = player.color;
  context.save();
  context.scale(-1, 1);
  
  context.drawImage(player.carpinchoImage, -player.x - player.width, player.y, player.width, player.height);
  context.restore();
}

// Función para dibujar las estructuras en el canvas
function drawStructures() {
  context.fillStyle = '#00ff00'; // Color verde para las estructuras
  for (const structure of structures) {
    context.fillRect(structure.x, structure.y, structure.width, structure.height);
    context.fillRect(structure.x, structure.y + structure.height + structureGap, structure.width, canvas.height - structure.height - structureGap);
  }
}

const game = {
  
    velocity: 2 // Velocidad inicial del juego
  };

const score = {
    value: 0,
    color: '#000000',
    x: canvas.width / 2,
    y: 30,
    font: '20px Arial'
  };
  
  const fallSpeedIncrease = 0.1; // Ajusta la velocidad de caída más rápida según prefieras

  function drawScore() {
    context.fillStyle = score.color;
    context.font = score.font;
    context.textAlign = 'center'; // Alineación centrada
    context.fillText(`Score: ${score.value}`, score.x, score.y);
  }
  

// Función principal de actualización del juego
function update() {
  // Borrar el canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Aplicar gravedad al personaje si no está saltando
  if (!player.isJumping) {
    player.y += player.velocityY;
    player.velocityY += 0.3; // Ajustar la fuerza de la gravedad aquí (reducida)
  }

  game.velocity += 0.001;

  // Limitar la posición y inferior para evitar que el personaje caiga fuera del canvas
  if (player.y + player.height > canvas.height) {
    restartGame();
    return;
  }

  // Limitar la posición y superior para evitar que el personaje toque el techo
  if (player.y < 0) {
    restartGame();
    return;
  }

 score.value++;

  // Aumentar la velocidad de caída del personaje con el tiempo
  player.velocityY += fallSpeedIncrease;


  // Dibujar el personaje y las estructuras
  drawPlayer();
  drawStructures();

 
  // Dibujar el marcador de puntuación
  drawScore();

  // ...


  // Mover las estructuras y verificar colisiones
  for (let i = 0; i < structures.length; i++) {
    const structure = structures[i];
    structure.x -= 2; // Velocidad de desplazamiento de las estructuras (ajustar según preferencia)
  
    // Verificar colisiones entre el personaje y las estructuras
    if (
      player.x + player.width > structure.x &&
      player.x < structure.x + structure.width &&
      (
        (player.y < structure.height && player.y + player.height > structure.y) ||
        (player.y + player.height > structure.y + structure.height + structureGap && player.y < canvas.height)
      )
    ) {
      restartGame();
      return;
    }

    // Eliminar las estructuras que están completamente fuera del canvas
    if (structure.x + structure.width < 0) {
      structures.splice(i, 1);
      i--;
    }
  }

  // Generar nuevas estructuras aleatoriamente
  if (
    structures.length === 0 ||
    canvas.width - structures[structures.length - 1].x >= structureGap + structureMargin
  ) {
    generateStructure();
  }

  // Solicitar el siguiente frame de animación
  requestAnimationFrame(update);
}

// Evento de teclado para manejar el salto
document.addEventListener('keydown', function (event) {
  if ((event.key === 'w' || event.key === 'W') && !player.isJumping) {
    player.isJumping = true;
    player.velocityY = -player.jumpStrength;
  }
});

// Evento de teclado para restablecer el salto
document.addEventListener('keyup', function (event) {
  if ((event.key === 'w' || event.key === 'W') && player.isJumping) {
    player.isJumping = false;
  }
});

document.addEventListener('keydown', function (event) {
    if ((event.key === 's' || event.key === 'S') && !player.isJumping) {
      player.velocityY += player.fastFallVelocity;
    }
  });

// Evento de teclado para reiniciar el juego
document.addEventListener('keydown', function (event) {
  if (event.key === 'r' || event.key === 'R') {
    restartGame();
  }
});

// Función para reiniciar el juego
function restartGame() {
  // Restablecer la posición y la velocidad del personaje
  player.y = canvas.height / 2;
  player.velocityY = 0;
  player.isJumping = false;

  // Limpiar el arreglo de estructuras
  structures.length = 0;
}

// Iniciar el juego llamando a la función de actualización
update();
