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
let rightPressed = false;
let upPressed = false;

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
		console.log("leftPressed\n\n\n\n");
	}
	// Key D
	if (e.code == "KeyD")//"0x0020")
	{
		rightPressed = true;
	}
	// Key W
	if (e.code == "KeyW")//"0x0011")
	{
		upPressed = true;
	}
}

function keyUpHandler(e)
{
	// Key A
	if (e.code == "KeyA")//"0x001E")
	{
		leftPressed = false;
	}
	// Key D
	if (e.code == "KeyD")//"0x0020")
	{
		rightPressed = false;
	}
	// Key W
	if (e.code == "KeyW")//"0x0011")
	{
		upPressed = false;
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
		this.gravity = -0.5;
		this.floorFriction = 0.5;
		this.width = 1;
		this.height = 1;
		// The speed is 2 units per second
		this.speed = 0.001;
		this.fallSpeed = 0;
		this.fallSpeedMax = 8/1000;
		this.onGround = false;
		this.isJumping = false;
		this.isFalling = false;
	}
}

class Camera
{
	constructor()
	{
		this.x = 0;
		this.y = 0;
		// The camera sensor size in game units.
		this.width = 16;
		this.height = 9;
	}
}

let MAP_WIDTH = 16;
let MAP_HEIGHT = 8;
let map = "";
map += "wwwwwwwwwwwwwwww";
map += "w  w           w";
map += "w  w           w";
map += "w  wwwwwwwwww  w";
map += "w              w";
map += "w              w";
map += "w    www       w";
map += "wwwwwwwwwwwwwwww";

let tp1 = Date.now();
let tp2 = Date.now();
let elapsedTime = 0;

// Create objects
let camera = new Camera();
/* The left-most block is x = 0, the bottom block is y = 0. Like a standard coordinate system.*/
camera.x = 0;
camera.y = 8;

let player = new Player();
player.x = 2;
player.y = 2;

window.main = function()
{
	window.requestAnimationFrame(main);
	// Get elapsed time for last tick.
	tp2 = Date.now();
	elapsedTime = tp2-tp1;
	//console.log("elapsedTime:" + elapsedTime + "\n");
	tp1 = tp2;
	
	//camera.x += 0.01;
	//camera.y -= 0.01;
	//camera.y += 1;
	/* Handle input */
	if (leftPressed)
	{
		player.velX -= player.speed * elapsedTime;

		// Check if player is out of bounds
		if (player.x < 0 || player.x+player.width > MAP_WIDTH || player.y < 0 || player.y+player.height > MAP_HEIGHT)
		{
			player.velX += player.speed * elapsedTime;
		}

		// Check if player has collided with game block
		let rect1X = Math.floor(player.x);
		let rect1Y = Math.floor(player.y);
		if (map[rect1X + rect1Y * MAP_WIDTH] != " ") {
			if (rect1X < player.x + player.width && rect1X + u > player.x)
			{
				console.log("collision detected!");
				player.velX += player.speed * elapsedTime;
			}
		}
	}

	if (rightPressed)
	{
		player.velX += player.speed * elapsedTime;

		// Check if player is out of bounds
		if (player.x < 0 || player.x + player.width > MAP_WIDTH || player.y < 0 || player.y + player.height > MAP_HEIGHT)
		{
			player.velX -= player.speed * elapsedTime;
		}

		// Check if player has collided with game block
		let rect1X = Math.round(player.x);
		let rect1Y = Math.round(player.y);
		if (map[rect1X + rect1Y * MAP_WIDTH] != " ") {
			if (rect1X < player.x + player.width && rect1X + u > player.x)
			{
				console.log("collision detected!");
				player.velX -= player.speed * elapsedTime;
			}
		}
	}

	if (upPressed)
	{
		console.log("up pressed\n");

		if (player.onGround == true)
		{
			player.velY += 1;
			player.onGround = false;
		}

		// Check if player is out of bounds
		if (player.x < 0 || player.x + player.width > MAP_WIDTH || player.y < 0 || player.y + player.height > MAP_HEIGHT)
		{
			player.velY -= 1;
			player.onGround = true;
		}

		// Check if player has collided with game block
		let rect1X = Math.round(player.x);
		let rect1Y = Math.round(player.y);
		if (map[rect1X + rect1Y * MAP_WIDTH] != " ") {
			if (rect1Y < player.y+ player.height && rect1Y + u > player.y)
			{
				console.log("collision detected!");
				player.velY -= 1;
				player.onGround = true;
			}
		}
	}

	/* Physics */
	if (player.onGround == false)
	{
		//player.velY -= 0.01;
	}

	let rect1X = Math.floor(player.x);
	let rect1Y = Math.floor(player.y);
	if (map[rect1X + rect1Y * MAP_WIDTH] != " ") {
		if (rect1Y < player.y + player.height && rect1Y + u > player.y) {
			console.log("collision detected!");
			player.y += 0.01;
			player.onGround = true;
			player.velY = 0;
		}
	}

	/* Update */
	player.x += player.velX * elapsedTime;
	player.y += player.velY * elapsedTime;
	console.log("player.x: " + player.x + "\n");
	console.log("player.y: " + player.y + "\n");
	console.log("player.velX: " + player.velX + "\n");
	console.log("player.velY: " + player.velY + "\n");
	if (player.velX != 0)
	{
		if (player.velX > 0)
		{
			player.velX -= player.floorFriction * elapsedTime;
		}
		if (player.velX < 0)
		{
			player.velX += player.floorFriction * elapsedTime;
		}
	}
	player.velY += player.gravity * elapsedTime;
	
	/* Show */
	/*
	for (let y = 0; y < SCREEN_HEIGHT; y += 1)
	{
		for (let x = 0; x < SCREEN_WIDTH; x += 1)
		{
			if (map[(camera.x+x) + (MAP_HEIGHT-camera.y+y) * MAP_WIDTH] == "w")
			{
				ctx.fillStyle = "000000";
				ctx.fillRect((camera.x+x) * 16, (MAP_HEIGHT-camera.y+y) * 16, 16, 16);
			}
		}
	}
	*/
	ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	// Draw map
	for (let y = 0; y < MAP_HEIGHT; y++)
	{
		for (let x = 0; x < MAP_WIDTH; x++)
		{
			if(map[x + (y * MAP_WIDTH)] == "w")
			{
				ctx.fillStyle = "#000000";
				ctx.fillRect((x-camera.x)*u, (y+camera.y-MAP_HEIGHT)*u, u, u);
			}
		}
	}
	
	// Draw player
	ctx.fillStyle = "#ff0000";
	ctx.fillRect((player.x - camera.x) * u, (camera.y - player.y - player.height)*u, player.width * u, player.height * u);
	
};

main();