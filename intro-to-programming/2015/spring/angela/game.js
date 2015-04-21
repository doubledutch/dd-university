// setup canvas
var width=900
var height=900
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
var snakeX = 3;
var snakeY = 3;
var directionX = 0;
var directionY = 0;
var snake = [];
var animationSpeed = 300;
var gameState = 0;
var score = 0;
var highScore = 0;

// // grid blocks
// blocks[getIndex(0,0)] = 1;
// blocks[getIndex(0,19)] = 1;
// blocks[getIndex(19,0)] = 1;
// blocks[getIndex(19,19)] = 1;


function getIndex(x, y){
    return (x + (y*columns));
}

function animate (){

    if (gameState === 1) {
        
        snake.push(getIndex(snakeX, snakeY));

        snakeX = snakeX + directionX;
        snakeY = snakeY + directionY;
        
        // if snake runs into wall, game over
        if (snakeX < 0 || snakeY < 0 || snakeX > columns -1 || snakeY > rows -1) {
            gameOver();

        // if snake eats apple    
        } else if (blocks[getIndex(snakeX, snakeY)] === 1) {
            blocks[getIndex(snakeX, snakeY)] = 0;
            blocks[getIndex(Math.floor(Math.random()*columns),
                            Math.floor(Math.random()*rows))] = 1;
            // Set (faster) animation speed after snake eats block
            
            window.clearInterval(animIntervalID);
            animationSpeed = animationSpeed - 10;
            animIntervalID = window.setInterval(animate, animationSpeed);
            score = score + 10;

        } else {
            snake.shift();
        }

        // if snake runs into itself, game over
        for (var i=1; i < snake.length; i++) {
            if (getIndex(snakeX, snakeY) === snake[i]) {
                gameOver();
            } 
        }
    }
}

function printMessage(txt) {
    ctx.font = '30pt Calibri';
    ctx.fillStyle="#FACC2E"
    ctx.fillText(txt, 50, 70, 800);
}

function gameOver() {
    gameState = 2;
    snake = [];

    printMessage("Game Over. Your score: " + score);
    getHighScore(score);
    printMessage("Press the space bar to start over.")
    window.clearInterval(animIntervalID)
    animationSpeed = 300;
    animIntervalID = window.setInterval(animate, animationSpeed);



}

function startGame() {
    printMessage("Press any arrow key to tell the snake which way to go");

    score = 0;
    snakeX = 3;
    snakeY = 3;

    directionX = 0;
    directionY = 0;

    blocks = [];

    for(var i=0; i<columns*rows; i++) {
        blocks.push(0);
    }   

    blocks[getIndex(Math.floor(Math.random()*columns),
                    Math.floor(Math.random()*rows))] = 1;
}

function getHighScore(playerScore) {
    if (playerScore >= highScore) {
        highScore  = playerScore
    }
}


// render graphics
function render(){
	ctx.fillStyle="#000000"
  	ctx.fillRect(0,0,width,height)

    // ctx.fillStyle="#FF0000"
    // ctx.fillRect(width/2,height/2, 100, 100)

    if (gameState === 0) {
        printMessage("Press space bar to start");
    } else if (gameState === 1) {
        printMessage("Use the arrows to eat the apple. Current Score: " + score)
        // printMessage("Snake just ate! Your score is now: " + score);

    } else if (gameState === 2) {
        printMessage("Game Over. Your score: " + score + " High score: " + highScore);

    }

    for(var ix=0; ix<columns; ix++) {
        for(var iy=0; iy<rows; iy++) {
            var block = blocks[getIndex(ix,iy)];

            if (block === 1) {
                ctx.fillStyle="#FF0000";
                ctx.fillRect(ix*blockSize, iy*blockSize, blockSize, blockSize);
            } else {
                // do nothing
            }
            ctx.fillStyle="#BFFF00";

            for(var i = 0; i < snake.length; i++) {
                if (snake[i] === getIndex(ix, iy)) {
                    ctx.fillRect(ix*blockSize, iy*blockSize, blockSize, blockSize);
                }
            }
        }
    }

    ctx.fillStyle="#BFFF00";
    ctx.fillRect(snakeX*blockSize, snakeY*blockSize, blockSize, blockSize);

  	QueueNewFrame()
}

// handle user input
function handleKeyPress(e){
	e=e||window.event
	if(e.keyCode==38){
        // up arrow
        if (directionY === 1) {

        } else {
            directionX = 0;
            directionY = -1;
        }

    }else if(e.keyCode==40){
        // down arrow

        if (directionY === -1) {

        } else {
            directionX = 0;
            directionY = 1;
        }

    }else if(e.keyCode==37){
       	// left arrow

        if (directionX === 1) {

        } else {
            directionX = -1;
            directionY = 0;
        }

    }else if(e.keyCode==39){
       	// right arrow
        
        if (directionX === -1) {

        } else {
            directionX = 1;
            directionY = 0;
        }

    }else if(e.keyCode==32){
    	gameState = 1;
        startGame();
    }
}
document.onkeydown=handleKeyPress

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
QueueNewFrame()

var animIntervalID = window.setInterval(animate, animationSpeed);