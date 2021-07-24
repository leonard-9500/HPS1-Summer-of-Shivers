/* Program: script.js
 * Programmer: Leonard Michel
 * Start Date: 22.07.2021
 * Last Change:
 * End Date: /
 * License: /
 * Version: 0.0.0.0
*/

/**** INITIALIZATION ****/
const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;
// How many pixels is one unit long.
const u = 64;

const canvas = document.getElementById("canvas");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
const ctx = canvas.getContext("2d");

let leftPressed = false;
let leftReleased = false;
let rightPressed = false;
let rightReleased = false;
let upPressed = false;
let upReleased = false;

// The collision precision in game units
let colPrec = 0.01;

// Get player input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e)
{
	// Key A
	if (e.code == "KeyA")//"0x001E")
	{
		leftPressed = true;
		leftReleased = false;
		console.log("leftPressed\n\n\n\n");
	}
	// Key D
	if (e.code == "KeyD")//"0x0020")
	{
		rightPressed = true;
		rightReleased = false;
	}
	// Key W
	if (e.code == "KeyW")//"0x0011")
	{
		upPressed = true;
		upReleased = false;
	}
}

function keyUpHandler(e)
{
	// Key A
	if (e.code == "KeyA")//"0x001E")
	{
		leftPressed = false;
		leftReleased = true;
	}
	// Key D
	if (e.code == "KeyD")//"0x0020")
	{
		rightPressed = false;
		rightReleased = true;
	}
	// Key W
	if (e.code == "KeyW")//"0x0011")
	{
		upPressed = false;
		upReleased = true;
	}
}

class Player
{
	constructor()
	{
		this.x = 0;
		this.y = 0;
		this.velX = 0;
		this.velY = 0;
		this.gravity = -0.01;
		this.floorFriction = 0.05;
		this.width = 1;
		this.height = 1;
		// The speed is 2 units per second
		this.speed = 0.001;
		this.fallSpeed = 0;
		this.fallSpeedMax = 8/1000;
		this.onGround = false;
		this.isJumping = false;
		this.isFalling = false;
		this.color = "#ff0000";
	}

	update()
	{
		/* Handle input */
		let xMove = 0;
		if (leftPressed)
		{
			player.velX = -player.speed * elapsedTime;
			xMove += 1;
		}
		else if (leftPressed == false)
		{
			xMove -=1;
		}

		if (rightPressed)
		{
			player.velX = player.speed * elapsedTime;
			xMove += 1;
		}
		else if (rightPressed == false)
		{
			xMove -= 1;
		}

		if (xMove == -2)
		{
			player.velX = 0;
		}

		if (upPressed) {
			console.log("up pressed\n");

			if (player.onGround == true)
			{
				player.velY += 0.05;
				player.onGround = false;
			}
		}

		if (player.onGround == false)
		{
			player.velY += player.gravity * elapsedTime;
		}

		// Check if player is out of bounds
		/*
		if (player.x < 0){ player.x = 0; player.velX = 0;};
		if (player.x + player.width > MAP_WIDTH) { player.x = MAP_WIDTH - player.width; player.velX = 0;};
		if (player.y < 0) { player.y = 0; player.velY = 0; player.onGround = true;};
		if (player.y + player.height > MAP_HEIGHT) { player.y = MAP_HEIGHT - player.height };
		*/

		player.x += player.velX * elapsedTime;
		player.y += player.velY * elapsedTime;

		// Check collision between player and every block on the map
		// In which direction does the player need to be pushed to resolve the collision.
		let up, right, down, left = false;
		let leftSide, topSide, rightSide, bottomSide = false;
		for (let y = 0; y < MAP_HEIGHT; y++)
		{
			for (let x = 0; x < MAP_WIDTH; x++)
			{
				up, right, down, left = false;
				leftSide, topSide, rightSide, bottomSide = false;
				if (map[x + y * MAP_WIDTH] == "w")
				{
					console.log("Block found at x: " + x + ", y: " + y + "\n");
					// If left edge of player is inside block
					if (player.x > x && player.x < x + 1)
					{
						player.x = Math.ceil(player.x);
						console.log("Player pushed to the right.\n");
					}
					// If right edge of player is inside block
					if (player.x + player.width > x && player.x + player.width < x + 1)
					{
						player.x = Math.floor(player.x);
						console.log("Player pushed to the left.\n");
					}

					// If bottom edge of player is inside block
					if (player.y > y && player.y < y + 1)
					{
						player.y = Math.ceil(player.y);
						bottomSide = true;
						player.onGround = true;
						console.log("Player pushed upward.\n");
					}
					// If top edge of player is inside block
					if (player.y + player.height > y && player.y + player.height < y + 1)
					{
						player.y = Math.floor(player.y);
						topSide = true;
						console.log("Player pushed downward.\n");
					}

					// If there is a block below the player, he's standing on the floor.
					if (map[player.x + (player.y) * MAP_WIDTH] == "w")
					{
						player.onGround = true;
						player.velY = 0;
					}
				}
			}
		}

		console.log("player.x: " + player.x + "\n");
		console.log("player.y: " + player.y + "\n");
		console.log("player.velX: " + player.velX + "\n");
		console.log("player.velY: " + player.velY + "\n");
	}
}

class Camera
{
	constructor()
	{
		this.x = 0;
		this.y = 0;
	}
}

let MAP_WIDTH = 16;
let MAP_HEIGHT = 8;
let map = "";
map += "1111111111111111";
map += "1  1           1";
map += "1  1           1";
map += "1  1111111111  1";
map += "1              1";
map += "1              1";
map += "1    111       1";
map += "1111111111111111";

let tp1 = Date.now();
let tp2 = Date.now();
let elapsedTime = 0;

// map char, name, visibility, destructibility, texture url
let blocks = [[0, 0, 0],
			  ["w", "Wall", true, false, "textures/wall.png"]];

let texturesLoaded = [];
for (let i = 0; i < 10; i++)
{
	texturesLoaded[i] = false;
}
console.log(texturesLoaded);

let textures = [];
/*
for (let i = 0; i < 10; i++)
{
	if (blocks[i+1][0] != 0)
	{
		textures[i] = new Image;
		textures[i].onload = function()
		{
			texturesLoaded[i] = true;
		}
		textures[i].src = blocks[i+1][4];
	}
}
*/


let img = new Image;
let imgLoaded = false;
img.onload = function()
{
	imgLoaded = true;
}
img.src = blocks[1][4];

console.log("texturesLoaded: " + texturesLoaded + "\n");

// Create objects
let camera = new Camera();
/* The left-most block is x = 0, the bottom block is y = 0. Like a standard coordinate system.*/
camera.x = 0;
camera.y = 8;

let player = new Player();
player.x = 1;
player.y = 0;

window.main = function()
{
	window.requestAnimationFrame(main);
	// Get elapsed time for last tick.
	tp2 = Date.now();
	elapsedTime = tp2-tp1;
	//console.log("elapsedTime:" + elapsedTime + "\n");
	tp1 = tp2;

	/* Update */
	player.update();
	
	/* Show */

	ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	// Draw map
	for (let y = 0; y < MAP_HEIGHT; y++)
	{
		for (let x = 0; x < MAP_WIDTH; x++)
		{
			let i = map[x + (y * MAP_WIDTH)];
			if (i != 0)
			{
				console.log("i: " + i + "\n");
				if(blocks[i][2] == true)
				{
					if (imgLoaded)
					{
						ctx.drawImage(img, (x - camera.x) * u, (y + camera.y - MAP_HEIGHT + 1) * u, u, u);
						//ctx.fillStyle = "#000000";
						//ctx.fillRect((x-camera.x)*u, (y+camera.y-MAP_HEIGHT)*u, u, u);
					}
				}
			}
		}
	}
	
	// Draw player
	ctx.fillStyle = player.color;
	ctx.fillRect((player.x - camera.x) * u, (camera.y - player.y - player.height)*u, player.width * u, player.height * u);
	
};

main();