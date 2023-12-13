let playerPaddle;
let aiPaddle;
let ball;
let playerScore = 0;
let aiScore = 0;
let bgColor;

function setup() {
  createCanvas(600, 400);
  playerPaddle = new Paddle(false);
  aiPaddle = new Paddle(true);
  ball = new Ball();
  bgColor = color(0);
}

function draw() {
  background(bgColor);

  playerPaddle.show(color(0, 0, 255));
  playerPaddle.update();

  aiPaddle.show(color(255, 0, 0)); 
  aiPaddle.update();

  ball.show();
  ball.update();

  // Mouse Control 
  playerPaddle.y = mouseY - playerPaddle.height / 2;
  playerPaddle.y = constrain(playerPaddle.y, 0, height - playerPaddle.height);

  
  aiPaddle.follow(ball);

  if (ball.checkPaddleCollision(playerPaddle) || ball.checkPaddleCollision(aiPaddle))
  {
    // changing Background
    bgColor = color(random(255), random(255), random(255));
  }

 
  if (ball.isOffScreen()) {
    if (ball.x < 0) {
      
      aiScore++;
    } else {
     
      playerScore++;
    }
    
    bgColor = color(0);
    ball.reset();
  }

  // Scores
  textSize(32);
  fill(255);
  textAlign(CENTER);
  text(playerScore + " - " + aiScore, width / 2, 50);
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

    // Bounce off top and bottom walls
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
