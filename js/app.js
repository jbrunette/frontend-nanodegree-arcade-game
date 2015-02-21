// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(config) {

  // Set player's sprite
  this.sprite = "images/char-boy.png";
  
  // Set tile width/height
  this.tile_width = 101;
  this.tile_height = 83;

  // Set player's initial position (bottom row, 3rd column, center of block)
  this.x = 203;
  this.y = 400;
};

// Update player's properties/position/etc
Player.prototype.update = function() {

};
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function(key) {

  // Handle keypresses
  switch (key) {

    // "up" - Move player up if possible
    case "up":

      // Calculate new X position
      var new_y = this.y - this.tile_height;
      
      // Is new_y less than 0?  Do nothing
      if (new_y < 0) {
        break;
      }
      
      // Move character up
      this.y = new_y;
      break;
  
  // "down" - Move player down if possible
  case "down":

    // Calculate new y position
    var new_y = this.y + this.tile_height;

    // Is new_y greater than the height of the canvas?  Do nothing
    if (new_y + this.tile_height * 2 > ctx.canvas.height) {
      break;
    }
    
    // Move character down
    this.y = new_y;
    break;

    // "left" - Move player left if possible
  case "left":
    
    // Calculate new x position
    var new_x = this.x - this.tile_width;

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
    var new_x = this.x + this.tile_width;

    // Is new_x greater than the width of the canvas?  Do nothing
    if (new_x > ctx.canvas.width) {
      break;
    }
    
    // Move character right
    this.x = new_x
    break;
  }

}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
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
