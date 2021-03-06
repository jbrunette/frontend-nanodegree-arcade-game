//////////////////////////////////////////////////
// Preload "wasted" image
//////////////////////////////////////////////////
var image_wasted = new Image();
image_wasted.src = "images/wasted.png";

//////////////////////////////////////////////////
// Define game board constants
//////////////////////////////////////////////////

// Vertical pixel distance between walkable rows
const PIXEL_VERT_WALK_DIST = 83;

// The first row's vertical walkable location
const PIXEL_VERT_WALK_FIRST_ROW = -25;

// Horizontal pixel distance between walkable columns
const PIXEL_HOR_WALK_DIST = 101;

// The first column's horitontal walkable location
const PIXEL_HOR_WALK_FIRST_COLUMN = 0;

// Sprite width
const SPRITE_WIDTH = 101;

// Enemies our player must avoid
var Enemy = function(row) {
  
  // Stores row we're on
  this.row = row;

  // Whether or not we are moving, and the range of milliseconds before movement processing starts
  this.move = false;
  this.move_start_min = 0; // 0 sec
  this.move_start_max = 3000; // 3 seconds

  // Speed range
  this.min_speed = 100;
  this.max_speed = 400;

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

  // Position bug in the requested row, left of canvas
  this.y = PIXEL_VERT_WALK_FIRST_ROW + Math.abs(PIXEL_VERT_WALK_DIST * (row - 1));

  // Reset bug
  this.reset();
}

// Resets bug's state and randomizes the start of movement processing
Enemy.prototype.reset = function(dt) {

  // Move bug to left of canvas and stop movement processing
  this.x = 0 - PIXEL_HOR_WALK_DIST;
  this.move = false;

  // Generate a random speed for the bug
  this.speed = Math.random() * (this.max_speed - this.min_speed) + this.min_speed;

  // Randomize movement start time and start timer
  var that = this;
  var start_time = Math.random() * (this.move_start_max - this.move_start_min) + this.move_start_min;
  setTimeout(function() {
    that.move = true;
  }, start_time);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

  // Move bug if we're doing position processing
  if (this.move == true) {
    this.x += this.speed * dt;
    
    /////////////////////////////////////////////////////////////
    // Player collision detection
    /////////////////////////////////////////////////////////////
    
    // If bug's sprite occupies the middle of the player's sprite and the bug is in the same row as the player, register a hit
    if (this.x < (player.x + (SPRITE_WIDTH / 2)) && (this.x + SPRITE_WIDTH) > (player.x + (SPRITE_WIDTH / 2)) && this.row == player.row) {
      player.hit();
    }

    // Is the bug off of the screen?  Reset bug
    if (this.x > ctx.canvas.width) {
      this.reset();
    }
  }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player class
var Player = function(config) {
  
  // Stores row we're on
  this.row = 6;

  // Set player's sprite
  this.sprite = "images/char-boy.png";
  
  // Stores our is_hit flag
  //   - During hit processing, this will prevent a simultaneous collision with multiple enemies from causing hit processing to occur multiple times
  this.is_hit = false;

  // Do initial reset (resets position, etc)
  this.reset();
};

// Reset player's state
Player.prototype.reset = function() {

  // Clear is_hit flag
  this.is_hit = false;
  
  // Move player to starting position (bottom row, middle column)
  this.x = PIXEL_HOR_WALK_FIRST_COLUMN + (PIXEL_HOR_WALK_DIST * 2);
  this.y = PIXEL_VERT_WALK_FIRST_ROW + (PIXEL_VERT_WALK_DIST * 5);
  
  // Update our current row
  this.row = 6;
}

// Update player's properties, etc
Player.prototype.update = function() {
};

// Display character on the canvas
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle user input
Player.prototype.handleInput = function(key) {

  // Only handle inputs if looping is enabled
  if (Engine_loop == false) {
    return;
  }
  
  // Handle keypresses
  switch (key) {

    // "up" - Move player up if possible
    case "up":

      // Calculate new X position
      var new_y = this.y - PIXEL_VERT_WALK_DIST;

      // Is new_y less than 0?  You won!
      if (new_y < 0) {
        alert("You won!");
        
        // Reset all bugs and player
        allEnemies.forEach(function(bug) {
          bug.reset();
        });
        player.reset();
        
        // Do no more processing
        break;
      }

      // Move character up
      this.y = new_y;
      this.row--;
      break;

    // "down" - Move player down if possible
    case "down":

      // Calculate new y position
      var new_y = this.y + PIXEL_VERT_WALK_DIST;

      // Is new_y greater than the height of the canvas?  Do nothing
      if (new_y + PIXEL_VERT_WALK_DIST * 2 > ctx.canvas.height) {
        break;
      }

      // Move character down
      this.y = new_y;
      this.row++;
      break;

    // "left" - Move player left if possible
    case "left":

      // Calculate new x position
      var new_x = this.x - PIXEL_HOR_WALK_DIST;

      // Is new_x less than 0?  Do nothing
      if (new_x < 0) {
        break;
      }

      // Move character left
      this.x = new_x;
      break;

    // "right" - Move player right if possible
    case "right":

      // Calculate new x position
      var new_x = this.x + PIXEL_HOR_WALK_DIST;

      // Is new_x greater than the width of the canvas?  Do nothing
      if (new_x >= ctx.canvas.width) {
        break;
      }

      // Move character right
      this.x = new_x
      break;
  }
}

// Handle character being hit
Player.prototype.hit = function() {
  
  // Are we already hit?  Don't do anything
  //   - Prevents collision with two bugs causing this to run twice
  if (player.is_hit == true) {
    return;
  }
  
  // Register that player is hit
  player.is_hit = true;
  
  // Stop engine loop
  Engine_loop = false;
  
  // Do "wasted" meme effect
  setTimeout(function() {
    
    // Dim play field
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 50, 505, 536);
    
    // Show "wasted" image
    setTimeout(function() {
      ctx.drawImage(image_wasted,60,120);    
      
      // Reset playfield
      setTimeout(function() {
        Engine_loop = true;
        player.reset();
      }, 3000);
    }, 1500);
  }, 10);
};

// Create enemies and player objects
//   - Enemy takes a row number as an argument
var allEnemies = [new Enemy(2), new Enemy(3), new Enemy(4), new Enemy(2), new Enemy(3), new Enemy(4)];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
