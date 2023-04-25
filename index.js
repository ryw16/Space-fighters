const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const SPACE_KEY = 32;
const PLUS_KEY = 187;

const HERO_MOVEMENT = 15;
const MAX_WIDTH = 1675;
const MAX_HEIGHT = 890;

let lastLoopRun = 0;
let score = 0;
let stage = 0;
let iterations = 0;
let controller = {};
let enemies = [];
let mainBox = document.getElementById("background");
let statusdiv = document.getElementById("statusdiv");
let startx = 0;
let starty = 0;
let distX = 0;
let distY = 0;
let hero = createSprite("hero", 750, 460, 50, 50);
let laser = createSprite("laser", 0, -120, 2, 50);
let laser2 = createSprite("laser2", 50, -120, 2, 50);
let laser3 = createSprite("laser3", 0, -120, 2, 50);
let elHero = document.getElementById("hero");
let gameover = false;
let shootSpeed = 30;
let justice;
let bullet_offset = -15;
let bullet_dist = 50;

// determine laser positio based on hero's position
function shoot() {
  if (laser.y <= 0) {
    laser.x = hero.x + bullet_offset;
    laser.y = hero.y - laser.h - 30;
  }
  if (laser2.y <= 0) {
    laser2.x = hero.x + bullet_offset + bullet_dist;
    laser2.y = hero.y - laser2.h - 30;
  }
  if (laser3.y <= 0) {
    laser3.x = hero.x + bullet_offset + bullet_dist * 2;
    laser3.y = hero.y - laser3.h - 30;
  }
}

function fireRate() {
  shootSpeed++;
  let laserElement = document.getElementById("laser");
  laserElement.style.height = "200px";
  laser.h = 200;

  let laser2Element = document.getElementById("laser2");
  laser2Element.style.height = "200px";
  laser2.h = 200;

  let laser3Element = document.getElementById("laser3");
  laser3Element.style.height = "200px";
  laser3.h = 200;
}

function restart() {
  lastLoopRun = 0;
  score = 0;
  stage = 0;
  iterations = 0;
  controller = {};
  mainBox = document.getElementById("background");
  statusdiv = document.getElementById("statusdiv");
  startx = 0;
  starty = 0;
  distX = 0;
  distY = 0;
  hero = createSprite("hero", 800, 460, 50, 50);
  laser = createSprite("laser", 0, -120, 2, 50);
  laser2 = createSprite("laser2", 50, -120, 2, 50);
  laser3 = createSprite("laser3", 0, -120, 2, 50);
  elHero = document.getElementById("hero");

  isGameOver(false);

  removeAllEnemy();
  loop();
  justice = new Audio("audio/Justice-One-Minute-To-Midnight.m4a");
  justice.play();
}

function createSprite(element, x, y, w, h) {
  var result = new Object();
  result.element = element;
  result.x = x;
  result.y = y;
  result.w = w;
  result.h = h;
  return result;
}

function setPosition(sprite) {
  var e = document.getElementById(sprite.element);
  e.style.left = sprite.x + "px";
  e.style.top = sprite.y + "px";
}

function toggleKey(keyCode, isPressed) {
  if (keyCode == LEFT_KEY) {
    controller.left = isPressed;
  }
  if (keyCode == UP_KEY) {
    controller.up = isPressed;
  }
  if (keyCode == RIGHT_KEY) {
    controller.right = isPressed;
  }
  if (keyCode == DOWN_KEY) {
    controller.down = isPressed;
  }
  if (keyCode == SPACE_KEY) {
    controller.space = isPressed;
  }
  if (keyCode == PLUS_KEY) {
    controller.plus = isPressed;
  }
}

//Tells if laser hits the enemies
function intersects(a, b, isLaser) {
  if (isLaser) {
    return a.x < b.x + b.w && a.x + a.w > b.x;
  }
}

//Boundaries
function ensureBounds(sprite, ignoreY) {
  if (sprite.x < 0) {
    sprite.x = 0;
  }
  if (!ignoreY && sprite.y < 40) {
    sprite.y = 40;
  }
  if (sprite.x + sprite.w > MAX_WIDTH) {
    sprite.x = MAX_WIDTH - sprite.w;
  }
  if (!ignoreY && sprite.y + sprite.h > MAX_HEIGHT) {
    sprite.y = MAX_HEIGHT - sprite.h - 0;
  }
  if (ignoreY && sprite.y + sprite.h > MAX_HEIGHT) {
    isGameOver(true);
  }
}

function handleControls() {
  if (controller.up) {
    hero.y -= HERO_MOVEMENT;
  }
  if (controller.down) {
    hero.y += HERO_MOVEMENT;
  }
  if (controller.left) {
    hero.x -= HERO_MOVEMENT;
  }
  if (controller.right) {
    hero.x += HERO_MOVEMENT;
  }
  if (controller.plus) {
    fireRate();
  }

  ensureBounds(hero);
}

function checkCollisions() {
  for (var i = 0; i < enemies.length; i++) {
    if (
      intersects(laser, enemies[i], true) ||
      intersects(laser2, enemies[i], true) ||
      intersects(laser3, enemies[i], true)
    ) {
      removeEnemy(i);
      i--;
      laser.y = -laser.h;
      laser2.y = -laser2.h;
      laser3.y = -laser3.h;
      score += 1;

      if (score == 3) {
        stage = 1;
        element = document.getElementById("laser2");
        element.style.visibility = "visible";
      }

      if (stage == 1) {
        element = document.getElementById("hero");
        element.style.backgroundImage = "url('images/heroship.gif')";
        element.style.height = "40px";
      }
      if (stage == 1) {
        element = document.getElementById("background");
        element.style.backgroundImage = "url('images/stage2_background.png')";
        element.style.height = "900px";
      }
    } else if (intersects(hero, enemies[i])) {
      isGameOver(true);
    } else if (enemies[i].y + enemies[i].h >= 940) {
      removeEnemy(i);
      i--;
    }
  }
}

//How the enemies move to the bottom of the screen.
function updatePosition() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].y += 4;
    enemies[i].x += getRandom(7) - 3;
    ensureBounds(enemies[i], true);
  }
}
function getRandom(maxSize) {
  return parseInt(Math.random() * maxSize);
}

function showSprites() {
  setPosition(hero);
  setPosition(laser);
  setPosition(laser2);
  setPosition(laser3);
  for (var i = 0; i < enemies.length; i++) {
    setPosition(enemies[i]);
  }
  var scoreElement = document.getElementById("score");
  scoreElement.innerHTML = "SCORE: " + score;
  var scoreElement = document.getElementById("stage");
  scoreElement.innerHTML = "STAGE: " + stage;
}

function removeEnemy(index) {
  removeEnemyElement(index);
  enemies.splice(index, 1);
}

function removeAllEnemy() {
  for (let i = 0; i < enemies.length; i++) {
    removeEnemyElement(i);
  }
  enemies = [];
}

function removeEnemyElement(index) {
  var element = document.getElementById(enemies[index].element);
  element.style.visibility = "hidden";
  element.parentNode.removeChild(element);
}

function isGameOver(gameOver) {
  let isHeroVisible = gameOver ? "hidden" : "visible";

  var element = document.getElementById(hero.element);
  element.style.visibility = isHeroVisible;
  element = document.getElementById("gameover");
  element.style.visibility = gameOver;

  if (gameOver) {
    let gameOverSfx = new Audio("audio/game-over.mp4");
    gameOverSfx.play();
  }
}

function addEnemy() {
  var interval = 50;
  if (iterations > 1500) {
    interval = 5;
  } else if (iterations > 1000) {
    interval = 20;
  } else if (iterations > 500) {
    interval = 35;
  }

  if (getRandom(interval) == 0) {
    var elementName = "enemy" + getRandom(10000000);
    var enemy = createSprite(elementName, getRandom(MAX_WIDTH), -40, 35, 35);

    var element = document.createElement("div");
    element.id = enemy.element;
    element.className = "enemy";
    document.children[0].appendChild(element);

    enemies[enemies.length] = enemy;
  }
}

function loop() {
  if (new Date().getTime() - lastLoopRun > 40) {
    updatePosition();
    handleControls();
    checkCollisions();
    addEnemy();
    showSprites();

    lastLoopRun = new Date().getTime();
    iterations++;
  }
  if (!gameover) {
    setTimeout("loop();", 1);
  }
  laser.y -= shootSpeed;
  laser2.y -= shootSpeed;
  laser3.y -= shootSpeed;
  shoot();
}

document.onkeydown = function (evt) {
  toggleKey(evt.keyCode, true);
};

document.onkeyup = function (evt) {
  toggleKey(evt.keyCode, false);
};

document.onload = function (evt) {
  restart();
};

function mouseHandler(e) {
  if (e.movementX > 0) {
    hero.x += HERO_MOVEMENT;
  } else {
    hero.x -= HERO_MOVEMENT;
  }
  if (e.movementY > 0) {
    hero.y += HERO_MOVEMENT;
  } else {
    hero.y -= HERO_MOVEMENT;
  }
  e.preventDefault();
}

mainBox.addEventListener(
  "touchstart",
  function (e) {
    var touchobj = e.changedTouches[0];
    startx = parseInt(touchobj.clientX);
    starty = parseInt(touchobj.clientY);

    e.preventDefault();
  },
  false
);

mainBox.addEventListener(
  "touchmove",
  function (e) {
    var touchobj = e.changedTouches[0];
    var distX = parseInt(touchobj.clientX) - startx;
    var distY = parseInt(touchobj.clientY) - starty;

    if (distX > 0) {
      hero.x += HERO_MOVEMENT;
    } else {
      hero.x -= HERO_MOVEMENT;
    }

    if (distY > 0) {
      hero.y += HERO_MOVEMENT;
    } else {
      hero.y -= HERO_MOVEMENT;
    }

    e.preventDefault();
  },
  false
);

mainBox.addEventListener(
  "touchend",
  function (e) {
    var touchobj = e.changedTouches[0];

    e.preventDefault();
  },
  false
);

loop();

document.addEventListener("DOMContentLoaded", (event) => {
  restart();
});
