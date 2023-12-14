let playerPaddle;
let aiPaddle;
let ball;
let playerScore = 0;
let aiScore = 0;
let bgColor;
let gameEnded = false;
let dingSound;
let errorSound;
let restartButton;

function preload() {
  dingSound = loadSound("ding.mp3");
  errorSound = loadSound("error.mp3");
}

function setup() {
  createCanvas(600, 400);
  noCursor();
  playerPaddle = new Paddle(false);
  aiPaddle = new Paddle(true);
  ball = new Ball();
  bgColor = color(0);

  restartButton = createButton("Restart");
  restartButton.position(width / 2, height / 2 + 525);
  restartButton.mousePressed(restartGame);
}

function draw() {
  background(bgColor);

  if (!gameEnded) {
    playerPaddle.show(color(0, 0, 255));
    playerPaddle.update();

    aiPaddle.show(color(255, 0, 0));
    aiPaddle.update();

    ball.show();
    ball.update();

    playerPaddle.y = mouseY - playerPaddle.height / 2;
    playerPaddle.y = constrain(playerPaddle.y, 0, height - playerPaddle.height);

    aiPaddle.follow(ball);

    if (
      ball.checkPaddleCollision(playerPaddle) ||
      ball.checkPaddleCollision(aiPaddle)
    ) {
      bgColor = color(random(255), random(255), random(255));

      dingSound.play();
    }

    if (ball.isOffScreen()) {
      if (ball.x < 0) {
        aiScore++;
      } else {
        playerScore++;
      }

      bgColor = color(0);
      ball.reset();

      errorSound.play();

      if (playerScore >= 10 || aiScore >= 10) {
        gameEnded = true;
        restartButton.show();
      }
    }

    textSize(32);
    fill(255);
    textAlign(CENTER);
    text(playerScore + " - " + aiScore, width / 2, 50);
  } else {
    textSize(32);
    fill(255);
    textAlign(CENTER);
    text("Game Over!", width / 2, height / 2 - 20);
    text(playerScore + " - " + aiScore, width / 2, height / 2 + 20);
  }
}

function restartGame() {
  playerScore = 0;
  aiScore = 0;
  gameEnded = false;
  bgColor = color(0);
  ball.reset();
  restartButton.hide();
}

class Paddle {
  constructor(isLeft) {
    this.width = 10;
    this.height = 80;
    this.y = height / 2 - this.height / 2;

    if (isLeft) {
      this.x = 0;
    } else {
      this.x = width - this.width;
    }

    this.ySpeed = 5;
  }

  update() {
    this.y += this.ySpeed;

    this.y = constrain(this.y, 0, height - this.height);
  }

  show(paddleColor) {
    fill(paddleColor);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }

  follow(ball) {
    const targetY = ball.y - this.height / 2;
    this.y += (targetY - this.y) * 0.1;
  }
}

class Ball {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.radius = 15;
    this.xSpeed = 5;
    this.ySpeed = 5;
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.y - this.radius < 0 || this.y + this.radius > height) {
      this.ySpeed *= -1;
    }
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
  }

  isOffScreen() {
    return this.x < 0 || this.x > width;
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
  }

  checkPaddleCollision(paddle) {
    if (
      this.x - this.radius < paddle.x + paddle.width &&
      this.x + this.radius > paddle.x &&
      this.y > paddle.y &&
      this.y < paddle.y + paddle.height
    ) {
      this.xSpeed *= -1;
      return true;
    }
    return false;
  }
}
