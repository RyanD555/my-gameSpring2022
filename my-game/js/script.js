class Sprite { //this seems similar to python's self
    constructor(x, y, w, h, speed, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.xVel = 1;
        this.yVel = 1;
        this.speed = speed;
        this.canBounce = true;
        this.isBullet = false;
        allSprites.push(this);
    }

    create(x, y, w, h, speed, color) {
        return new Sprite(x, y, w, h, speed, color); //ALWAYS make sure a constructor has all arguements. Creates a lot of problems
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    collision(obj) {
        if (this.x + this.w >= obj.x && this.x <= obj.x + obj.w && this.y + this.h >= obj.y && this.y <= obj.y + obj.h) {
            return true;
        }
    }

    update() {
        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;

        if (this.canBounce){ //for bouncing bullets, should have made seperate bullet class
            if (this.x > WIDTH - this.w) {
                this.xVel = -1;
            }
    
            if (this.y > HEIGHT - this.h) {
                this.yVel = -1;
            }
    
            if (this.x < 0) {
                this.xVel = 1;
            }
    
            if (this.y < 0) {
                this.yVel = 1;
            }
        }
    }
}

class Wall extends Sprite { //inheritance
    constructor(x, y, w, h, speed, color) {
        super(x, y, w, h, speed, color);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.color = color;
        allSprites.push(this);
        allWalls.push(this);
    }

    create(x, y, w, h, color) {
        return new Wall(x, y, w, h, 0, color);
    }
}

class Cactus extends Sprite { //inheritance
    constructor(x, y, w, h, speed, color) {
        super(x, y, w, h, speed, color);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.color = "rgb(0, 200, 0)";
        allCacti.push(this);
    }

    create(x, y, w, h) {
        return new Cactus(x, y, w, h, 0, this.color);
    }
}

class Player extends Sprite{
    constructor(x, y, w, h, speed, color) {
        super(x, y, w, h, speed, color);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = 0;
        this.vy = 0;
        this.gravity = 0.5;
        this.coFriction = 1.5;
        this.jumpPower = 15;
        this.canJump = true;
        this.color = color;
        this.speed = speed;
        this.hp = 100;
        this.invulnerable = false;
        this.direction = "left";
        allSprites.push(this);
    }

    input() {
        if (" " in keysDown) {
            if (this.canJump) {
                this.jump();
                this.canJump = false;
            }
        }
        if ("a" in keysDown) { //for some reason, bullets will now work while a key held down. will fix in final project
            this.vx = -this.speed;
            this.direction = "left";
        }
        if ("d" in keysDown) {
            this.vx = this.speed;
            this.direction = "right";
        }

        if ("b" in keysDown) {
            this.shoot();
        }

        if ("c" in keysDown) { //clear all bullets from screen, super laggy if there are a lot of bullets because it is linear
            for (i of allSprites) {
                if (i instanceof Sprite) { //should probably use inheritance here, then can make allBullets and use delete keyword
                    if (i.isBullet) {
                        i.x = 999999999; //get it the hell out of here
                        i.y = 999999999;
                        i.xVel = 0;
                        i.yVel = 0;
                    }
                }
            }
        }
    }

    jump() {
        this.direction = "up";
        this.vy = -this.jumpPower;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    shoot() { //problem is that one key press shoots 4 - 6 bullets
        let bullet = new Sprite(this.x + (this.w / 2) - 30, this.y + (this.h / 2) - 30, 30, 30, 15, "rgb(" + randNum(0, 255) + "," + randNum(0, 255) + "," + randNum(0, 255) + ")");
        bullet.canBounce = false;
        bullet.isBullet = true;
        bulletCount++;
        if ("v" in keysDown) {
            bullet.canBounce = !bullet.canBounce; //toggles if the bullet can bounce, must be held
        }
        switch (this.direction) {
            case "up":
                bullet.xVel = 0;
                bullet.yVel = -1;
                break;
            // case "down":
            //     bullet.xVel = 0;
            //     bullet.yVel = 1;
            //     break;
            case "left":
                bullet.xVel = -1;
                bullet.yVel = 0;
                break;
            case "right":
                bullet.xVel = 1;
                bullet.yVel = 0;
                break;
        }
        return bullet;
    }

    friction() {
        if (this.vx > 0.5){
            this.vx -= this.coFriction;
        }
        else if (this.vx < -0.5){
            this.vx += this.coFriction;
        }
        else {
            this.vx = 0;
        }
    }

    update() {
        this.vy += this.gravity;
        this.friction();
        this.input();
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > WIDTH - this.w){
            this.x = WIDTH - this.w;
         }
        if (this.x < 0){
            this.x = 0;
         }
        if (this.y > HEIGHT - this.h){
            this.y = HEIGHT - this.h;
         }
        if (this.y < 0){
            this.y = 0;
         }
        //death state
        if (this.hp <= 0) {
            console.log("dead");
        }
    }
}

class Circle {
    constructor(x, y, w, h, speed, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.speed = speed;
        this.xVel = 1;
        this.yVel = 1;
        allSprites.push(this);
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI); //all you need to draw a circle
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;

        if (this.x > WIDTH - this.w) {
            this.xVel = -1;
        }

        if (this.y > HEIGHT - this.w) {
            this.yVel = -1;
        }

        if (this.x < this.w) {
            this.xVel = 1;
        }

        if (this.y < this.w) {
            this.yVel = 1;
        }
    }
}

//globals
let canvas = null;
let ctx = null;
let allSprites = [];
let allWalls = [];
let allCacti = [];
let bulletCount = 0;
let fps;
let then = performance.now();

const WIDTH = 1024;
const HEIGHT = 768;
const TILE_SIZE = 32;
const levelLayout = `
................................
................................
.......#######..................
..........................C.....
....C.....................######
#######.........................
#######.........................
#######.........................
#######.....#####...............
.......................C........
.......................#########
................................
................................
................................
................................
................................
.......................C........
.....................###........
...........#############........
................................
................................
................................
..............C.................
################################`;//24 * 32 string grid, holds level layout

const levelChars = { //literally just a python dictionary
    ".": "empty",
    "#": Wall,
    "C": Cactus,
};

//keys
let keysDown = {};
let keysUp = {};

addEventListener("keydown", function (event){ //allows us to listen to keys
    keysDown[event.key] = true;
    //console.log(event);
}, false);

addEventListener("keyup", function(event) {
    keysUp[event.key] = true;
    delete keysDown[event.key]; //delete removes var of an object
    //console.log(event);
}, false);

//Functions
function randNum(min, max) { //from stack overflow
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
}

function drawText(r, g, b, a, font, align, base, text, x, y) {
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = base;
    ctx.fillText(text, x, y);
}

function update() {
    for (sprite of allSprites) { //now dont have to call every single object method
        sprite.update();
    }
    for (cactus of allCacti) {
        if (cactus.collision(player)) {
            if (!player.invulnerable) {
                player.hp--; //should add damage var
                player.invulnerable = true;
                setTimeout(() => {player.invulnerable = false}, 500); //anonymous function, better than lambda, should add hurt interval var
            }
        }
    }

    for (wall of allWalls) { //doesnt work well, collision always happens 
        if (wall.collision(player)) { //making the velocities 0 will make walls quicksand
            player.y = wall.y - player.h;
            player.vy = 0;
            player.canJump = true;
        }
    }
}

function draw() { //should make condition that doesnt clear board, death bleed effect
    ctx.clearRect(0, 0, WIDTH, HEIGHT); //prevents "smearing". really cool if you delete this line though. maybe art maker engine?
    for (i of allSprites) {
        i.draw();
    }
    drawText(0, 0, 0, 1, "20px Helvetica", "left", "top", "FPS: " + fps, WIDTH - 100, 10);
    drawText(255, 0, 0, 1, "20px Helvetica", "left", "top", "Health: " + player.hp, 10, 10);
}

function gameLoop() {
    now = performance.now();
    let delta = now - then;
    fps = (Math.ceil(1000 / delta)); //fps tracking
    // totaltime = now - then;
    then = now;
    update();
    draw();
    window.requestAnimationFrame(gameLoop); //constantly looks for change, is like pygame.display.flip()
}

function makeGrid(plan, width) {
    let newGrid = [];
    let newRow = [];

    for (i of plan){
        if (i != "\n"){
            newRow.push(i);
        }
        if (newRow.length % width == 0 && newRow.length != 0) {
            newGrid.push(newRow);
            newRow = [];
        }
    }
    return newGrid;
}

function readLevel(grid) {
    let startActors = [];
    for (y in grid) {
        for (x in grid[y]) {
 
            let char = grid[y][x];
 
            if (char !== "\n" && char !== "\t" && char !== " ") { //done because some text editors see these chars
                let type = levelChars[char];
                if (typeof type == "string") {
                    startActors.push(type);
                } 
                else {
                    let t = new type;
                    startActors.push(t.create(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, "rgb(0, 0, 200)"));
                }
            }
        }
    }
}

function init() {
    let gameDiv = document.createElement("div");
    gameDiv.setAttribute("style", "border: 1px solid;"
    + "width:" + WIDTH + "px;"
    + "height:" + HEIGHT + "px;"
    + "margin-left: auto; margin-right: auto;"); //center div
    document.body.appendChild(gameDiv);
    //Canvas
    canvas = document.createElement("canvas"); //makes canvas
    ctx = canvas.getContext("2d"); //canvas context
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas); //init canvas
    try {
        gameDiv.appendChild(canvas);
        console.log("game init");
    } 
    catch(e) {
        alert(e.message); //e has message attribute
    }
    gameLoop();
}

readLevel(makeGrid(levelLayout, 32)); //make sure the width is right, this is perfect width

//instances
// let sprite0 = new Sprite(0, 0, 100, 50, 5, "rgb(255, 255, 0)");
// let sprite1 = new Sprite(30, 20, 100, 50, 10, "rgb(255, 194, 194)");
// let sprite2 = new Sprite(400, 20, 100, 50, 7, "rgb(0, 200, 200)");
// let circle0 = new Circle(300, 300, 50, 90, 8, "rgb(255, 0, 0)");
// let circle1 = new Circle(500, 500, 30, 5, 20, "rgb(0, 0, 0)");
let player = new Player(WIDTH / 2, HEIGHT / 2, 64, 64, 5, "rgb(255, 255, 0)");