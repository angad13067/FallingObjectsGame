const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//Canvas dimensions
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

//player properties
const player=
{
    width:80, 
    height: 20,
    x: canvasWidth/2 - 40, //centered horizontally
    y: canvasHeight - 30, //positioned at bottom
    speed: 10,
    dx: 0 //change x-axis
};

//falling objects array
let objects = [];

//game properties
let score = 0;
let gameOver = false;
let numLives=3;
//listen for keyboard events

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e)
{
    if(e.key === 'ArrowRight' || e.key === 'Right')
    {
        player.dx = player.speed;
    }
    else if (e.key === 'ArrowLeft' || e.key === 'Left')
    {
        player.dx= -player.speed;
    }
}

function keyUp(e)
{
    if(e.key === 'ArrowRight' || 
        e.key === 'Right' ||
        e.key === 'ArrowLeft'||
        e.key === 'Left'
    )
    {
        player.dx = 0;
    }
    
}

//update player position

function movePlayer()
{
    player.x += player.dx;

    //prevent player from going offscreen

    if(player.x < 0)
    {
        player.x = 0;
    }
    else if(player.x + player.width > canvasWidth)
    {
        player.x = canvasWidth - player.width;
    }
}

//create falling objects
//generate at random positions

function createObject()
{
    const object = {
        x: Math.random() * (canvasWidth - 20),
        y: -20, //start above the canvas (falling in animation)
        width: 20,
        height: 20,
        speed: 3+ Math.random() * 2 //random speed between 3 and 5
    };
    objects.push(object);
}

//move object position and check for collision with bottom of canvas or player
function updateObjects() {
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      obj.y += obj.speed; //updates y position of object by adding its speed
  
      // Check for collision with player
      if (
        obj.x < player.x + player.width &&
        obj.x + obj.width > player.x &&
        obj.y < player.y + player.height &&
        obj.y + obj.height > player.y
      ) {
        // Object caught
        score++;
        objects.splice(i, 1); //remove object from array
        i--;
      } else if (obj.y > canvasHeight) {
        // Object missed
        //live system
        numLives --;
        objects.splice(i,1);
        i--;
        if (numLives===0)
        {
          gameOver = true;
        }
      }
    }
  }

  //draw game elements
  function drawPlayer() {
    ctx.fillStyle = '#0a0';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
  
  function drawObjects() {
    ctx.fillStyle = '#a00';
    objects.forEach((obj) => {
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });
  }
  
  function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30); //template literal
  }

  //update and render game
  function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }
  
  function gameLoop() {
    if (gameOver) {
      alert(`Game Over! Your score is ${score}`);
      document.location.reload();
      return;
    }
  
    clearCanvas();
    movePlayer();
    updateObjects();
  
    drawPlayer();
    drawObjects();
    drawScore();
  
    requestAnimationFrame(gameLoop);
  }

  //start game
  gameLoop();

  //spawn objects every second
  setInterval(createObject, 1000);

  //Custom gameover alert based on score
