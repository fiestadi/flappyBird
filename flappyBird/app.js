let board;
let boardWidth = 288;
let boardHeight = 512;
let ctx;
let fg;
let fgWidth = 288;
let fgHeight = 102;
let fgX = 0;
let fgY = boardHeight - fgHeight;
let birdWidth = 34;
let birdHeight = 24;
let birdY = boardHeight / 3;
let birdX = boardWidth / 8;
let gameOver = false;
let birdImg;
let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight
}
//pipes
let pipes = [];
let pipeWidth = 54;
let pipeHeight = 312;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;
let velocityX = -2; // pipes speed
let velocityY = 0;
let grav = 0.4;
let gameOverImg;
let score = 0;
let lives = 3;
let currentLife = 0;
let lifeStatus = [true, true, true];
let lifeImage = new Image();
lifeImage.src = './image/heart.png'
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  ctx = board.getContext('2d');// inicializacia konteksta dlia risovania
  // draw flappy bird
  //  ctx.fillStyle = 'green';
  //  ctx.fillRect(bird.x, bird.y, bird.width, bird.height)
  // load images
  birdImg = new Image();
  birdImg.src = './image/flappy_bird_bird.png';
  birdImg.onload = function () {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };
  topPipeImg = new Image;
  topPipeImg.src = './image/flappy_bird_pipeUp.png';
  bottomPipeImg = new Image();
  bottomPipeImg.src = './image/flappy_bird_pipeBottom.png';
  fg = new Image();
  fg.src = './image/flappy_bird_fg.png';
  gameOverImg = new Image();
  gameOverImg.src = './image/game-over.png';

  requestAnimationFrame(update);
  setInterval(placePipes, 1500); // pipe budut kaydie 1,5sec
  document.addEventListener('keydown', moveBird);
};

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
      if (currentLife < lives) {
        bird.y = birdY;
        pipes = [];
        gameOver = false;
      } else {
        ctx.clearRect(0, 0, boardWidth, boardHeight);
        const gameOverX = (boardWidth - gameOverImg.width) / 2;
        const gameOverY = (boardHeight - gameOverImg.height) / 2;
        ctx.drawImage(gameOverImg, gameOverX, gameOverY);
        return;
      }
    }
    ctx.clearRect(0, 0, boardWidth, boardHeight);
    // background fg
    ctx.drawImage(fg, fgX, fgY, fgWidth, fgHeight);

    //otobrazhenie life
    for (let i = 0; i < lives; i++) {
      if (lifeStatus[i]) {
        let x = 25 + i * (lifeImage.width + 5);
      let y = 10;// visota zhizni
      ctx.drawImage(lifeImage, x, y, lifeImage.width, lifeImage.height);
    }
  }
    //bird
    velocityY += grav;
    bird.y = Math.max(bird.y + velocityY, 0);
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    
    //pipes
    for (let i = 0; i < pipes.length; i++) {
      let pipe = pipes[i];
      pipe.x += velocityX;
      ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
      if (!pipe.passed && bird.x > pipe.x + pipe.width) {
        score += 0.5;
        pipe.passed = true;
      }
      if (getCollision(bird, pipe)) {
        if (lifeStatus[currentLife]) {
          lifeStatus[currentLife] = false; 
          currentLife++;
          if (currentLife >= lives) {
            gameOver = true;
          }
        }
      }
    }

    //clear pipes
    while (pipes.length > 0 && pipes[0].x < pipeWidth) {
      pipes.shift();
    }
  
    //score
    ctx.fillStyle = 'white';
    ctx.font = '15px sans-serif';
    ctx.fillText('score :', 205, 25);
  
  }

  function placePipes() {
    if (gameOver) {
      return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;
    let topPipe = {
      img: topPipeImg,
      x: pipeX,
      y: randomPipeY,
      width: pipeWidth,
      height: pipeHeight,
      passed: false

    }
    pipes.push(topPipe);

    let bottomPipe = {
      img: bottomPipeImg,
      x: pipeX,
      y: randomPipeY + pipeHeight + openingSpace,
      width: pipeWidth,
      height: pipeHeight,
      passed: false
    }

    pipes.push(bottomPipe);
  }
  function moveBird(e) {
    if (e.code == 'Space' || e.code == 'ArrowUp' || e.code == 'keyX') {
      //jump
      velocityY = -6;
      //reset game 
      if (gameOver) {
        bird.y = birdY;
        pipes = [];
        gameOver = false;
        lives = 3;
        score = 0;
        currentLife = 0;
      lifeStatus = [true, true, true];
      }
    }
  }
  function getCollision(a, b) {
    return a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;
  }
