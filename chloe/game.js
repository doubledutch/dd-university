// setup canvas
var width=800
var height=800
var canvas=document.getElementById("canvas")
canvas.width=width
canvas.height=height
canvas.style.width=(width/2)+"px"
canvas.style.height=(height/2)+"px"
var ctx = canvas.getContext("2d")

// game logic
var blocks = [];
var columns = 20;
var rows = 20;
var blockSize = width / columns;
var snakeX;
var snakeY;
var directionX;
var directionY;
var snake;
var state = 0;
var score;
var highScore = 0;
var changeDirection;
var scoreIncrement;
var buttonWidth = 150;
var buttonHeight = 100;
var buttonYAxis = 400;
var animIntervalID;

var easy = {
	levelName:'easy',
	runsEveryXms:300,
	increaseScoreBy:1
};

var medium = {
	levelName:'medium',
	runsEveryXms:180,
	increaseScoreBy:3
};

var hard = {
	levelName:'hard',
	runsEveryXms:50,
	increaseScoreBy:5
};

var getIndex = function(x, y) {
	return (x + (y * columns));
}

for (var i = 0; i < columns * rows; i++) {
	blocks.push(0);
}

function printMessage(text, x, y, maxWidth) {
  ctx.fillStyle = "#000000"
  ctx.font = "30px Helvetica";
  ctx.fillText(text, x, y, maxWidth);
}

function createLevelButton(color, levelName, buttonXAxis, levelNameAlignment){
	ctx.fillStyle = color;
	ctx.fillRect(buttonXAxis, buttonYAxis, buttonWidth, buttonHeight)
	ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeRect(buttonXAxis,buttonYAxis, buttonWidth,buttonHeight);
    ctx.fillStyle="#000000";
	ctx.fillText(levelName, levelNameAlignment, 460, 100);
}

// render graphics
function render(){
	ctx.fillStyle="#AAA"
  	ctx.fillRect(0,0,width,height)


	if (state == 0) {
	  // waiting for game
	  window.clearInterval(animIntervalID);
      printMessage("WELCOME TO SNAKE", width/3.4, 330, 500);
      createLevelButton("#9ACD32", easy.levelName, width/8, 140);
      createLevelButton("#f2eb22", medium.levelName, width/2.5, 345);
      createLevelButton("#eb2f2f", hard.levelName, width/1.5, 575);			
	} else if (state == 1) {
		// game running
		for (var ix = 0; ix < columns; ix++ ) {
			for (var iy = 0; iy < rows; iy++) {
				var b = blocks[getIndex(ix, iy)];
				if (b == 1) {
					ctx.fillStyle="#000000";
					ctx.fillRect(ix *blockSize, iy * blockSize, blockSize, blockSize);
				} else {
				}
				ctx.fillStyle = "#10db0d";
				for (var i = 0; i < snake.length; i++) {
					if (snake[i] == getIndex(ix, iy)) {
						ctx.fillRect(ix *blockSize, iy * blockSize, blockSize, blockSize);
					}
				}
			}
		}
      	printMessage("SCORE: " + score, 350, 50, 500);
	} else if (state == 2){
	  // game over
	  	gameOver();
      	for (var ix = 0; ix < columns; ix++ ) {
        	for (var iy = 0; iy < rows; iy++) {
          		var b = blocks[getIndex(ix, iy)];
          		if (b == 1) {
            		ctx.fillStyle="#000000";
            		ctx.fillRect(ix *blockSize, iy * blockSize, blockSize, blockSize);
          		} else {

         		 }
          		ctx.fillStyle = "#10db0d";
          		for (var i = 0; i < snake.length; i++) {
            		if (snake[i] == getIndex(ix, iy)) {
              			ctx.fillRect(ix *blockSize, iy * blockSize, blockSize, blockSize);
            		}
          		}
        	}
      	}
	}
	ctx.fillStyle = "#10db0d"
	ctx.fillRect(snakeX * blockSize, snakeY * blockSize, blockSize, blockSize);

	QueueNewFrame()
}

// handle user input
function handleKeyPress(e){
	e=e||window.event
	if(e.keyCode==38 && directionY != 1 && changeDirection){
        // up arrow
		directionX = 0;
		directionY = -1;
		changeDirection = false;
    }else if(e.keyCode==40 && directionY != -1 && changeDirection){
        // down arrow
		directionX = 0;
		directionY = 1;
		changeDirection = false;
    }else if(e.keyCode==37 && directionX != 1 && changeDirection){
       	// left arrow
		directionX = -1;
		directionY = 0;
		changeDirection = false;
    }else if(e.keyCode==39 && directionX != -1 && changeDirection){
       	// right arrow
		directionX = 1;
		directionY = 0;
		changeDirection = false;
    }else if(e.keyCode==32){
    	// space bar
		state = 1;
		startGame();
    }else if(e.keyCode==27){
		// escape
		state = 0;

	}
}
document.onkeydown=handleKeyPress

function handleClick(e){
	e=e||window.event
	var canvas = document.getElementById('canvas'),
    x = event.pageX - canvas.offsetLeft,
    y = event.pageY - canvas.offsetTop;
    
    var dx = buttonWidth/2;
    var yPlusdy = buttonYAxis/2 + buttonHeight/2;
    console.log(x + ' ' + y);
    if(width/16 < x && x < width/16 + dx && buttonYAxis/2 < y && y < yPlusdy){
    	setLevelSpeed(easy.runsEveryXms);
    	scoreIncrement = easy.increaseScoreBy;
    	state = 1;
    	startGame();
    }else if(width/5 < x && x < width/5 + dx && buttonYAxis/2 < y && y < yPlusdy){
    	setLevelSpeed(medium.runsEveryXms);
    	scoreIncrement = medium.increaseScoreBy;
    	state = 1;
    	startGame();
    }else if(width/3 < x && x < width/3 + dx && buttonYAxis/2 < y && y < yPlusdy){
    	setLevelSpeed(hard.runsEveryXms);
    	scoreIncrement = hard.increaseScoreBy;
    	state = 1;
    	startGame();
    }
}
document.onclick=handleClick

function initGame() {
  	blocks = []
  	snakeX = 3;
  	snakeY = 3;
  	directionX = 0;
  	directionY = 0;
  	state = 0;
  	snake = [];
  	score = 0;
  	changeDirection = true;
}

function startGame(){
	initGame();
	state = 1;
	blocks[getIndex(8, 8)] = 1;
	for (var i = 0; i < columns * rows; i++) {
		blocks.push(0);
	}
}

// call if you go outside screen OR if you hit yourself
function gameOver(){
 	state = 2;
 	if (score >= highScore && score != 0) {
    	highScore = score;
    	printMessage("NEW HIGH SCORE OF " + highScore + "! Hit the space bar to play again.", 60, 60, 700);
  	} else {
  		printMessage("GAME OVER, your score is " + score + ". Hit the space bar to play again.", 60, 60, 700);
  	}
}	

function animate(){
	if (state != 1) {
		return;
	}
	//console.log(snake[0]);
	snake.push(getIndex(snakeX, snakeY));
	snakeX = snakeX + directionX;
	snakeY = snakeY + directionY;
	if (blocks[getIndex(snakeX, snakeY)] == 1) {
		blocks[getIndex(snakeX, snakeY)] = 0;
		blocks[getIndex(Math.floor(Math.random()*columns),
										Math.floor(Math.random()*rows))] = 1;
    	score += scoreIncrement;
	} else {
		snake.shift();
	}
	// if snake hits boundary, game over
	if (snakeX < 0 || snakeX > 19 || snakeY < 0 || snakeY > 19) {
		gameOver();
	}
	// if snake head hits body, GAME OVER
	for (var i = 0; i < snake.length; i++) {
		if (getIndex(snakeX, snakeY) == snake[i]) {
			gameOver();
		}
	}

	if (state == 0) {

	}
	changeDirection = true;
}

// setup an event that calls render each frame
var intervalID=-1
var QueueNewFrame=function(){
    if(window.requestAnimationFrame){
        window.requestAnimationFrame(render)
    }else if(window.msRequestAnimationFrame){
        window.msRequestAnimationFrame(render)
    }else if(window.webkitRequestAnimationFrame){
        window.webkitRequestAnimationFrame(render)
    }else if(window.mozRequestAnimationFrame){
        window.mozRequestAnimationFrame(render)
    }else if(window.oRequestAnimationFrame){
        window.oRequestAnimationFrame(render)
    }else{
        QueueNewFrame=function(){}
        intervalID=window.setInterval(render,1000/30)
    }
}

function setLevelSpeed(level){
	animIntervalID = window.setInterval(animate, level);
}

QueueNewFrame();
