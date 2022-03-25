class Square { //this seems similar to python's self
    constructor(x, y, w, h, speed, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.xVel = 1;
        this.yVel = 1;
        this.speed = speed
        allSprites.push(this);
    }

    create(x, y, w, h) {
        return new Square(x, y, w, h);
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    update() {
        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;

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
            this.yVel = 1
        }
    }
}

class Circle { //no inheritance yet, very unfortunate
    constructor(x, y, w, h, speed, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.speed = speed;
        this.xVel = 1;
        this.yVel = 1;
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
            this.yVel = 1
        }
    }
}

//globals
let canvas = null;
let ctx = null;
let gameTick = 0; //i dont think that i will use game tics, but it will be nice to have i guess
let allSprites = [];

const WIDTH = 1024;
const HEIGHT = 768;
const BACKGROUND = "rgb(201, 76, 76)"; //didnt work, doesnt really matter
const TILE_SIZE = 32;
const levelLayout = `
......................############## 
######................##############
######......####......##############
............#######.................
....................................
....................................
...........###......................
...........###......................
...........###......................
##############........####..........
##############........####..........
##############........####..........
....................................
....................................
####...#############################`; //i should do this in pygame
const levelChars = { //literally just a python dictionary
    ".": "empty",
    "#": Square,
};

function update() {
    for (i of allSprites) { //now dont have to call every single object method, just put them in the list at the bottom
        i.update();
    }
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT); //prevents "smearing". really cool if you delete this line though. maybe art maker engine?
    for (i of allSprites) {
        i.draw();
    }
}

function gameLoop() {
    //console.log("working");
    //console.log(gameTick)
    gameTick++;
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

            if (char != "\n") {
                let type = levelChars[char];
                if (typeof type == "string") {
                    startActors.push(type);
                } 
                else {
                    let t = new type;
                    startActors.push(t.create(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE));
                }
            }
        }
    }
}

console.log(readLevel(makeGrid(levelLayout, 36)))

function init() {
    //div
    let gameDiv = document.createElement("div");
    gameDiv.setAttribute("style", "border: 1px solid;"
    + "width:" + WIDTH + "px;"
    + "height:" + HEIGHT + "px;"
    + "background-color:" + BACKGROUND + "px; margin-left: auto; margin-right: auto;"); //center div
    document.body.appendChild(gameDiv);
    //Canvas
    canvas = document.createElement("canvas"); //makes canvas
    ctx = canvas.getContext("2d"); //canvas context
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas); //init canvas
    try { //seems kinda unnecessary honestly
        gameDiv.appendChild(canvas);
        console.log("game init");
    } 
    catch(e) {
        alert(e.message); //e has message attribute
    }
    gameLoop();
}

//instances
let square0 = new Square(0, 0, 100, 50, 5, "rgb(255, 255, 0)");
let square1 = new Square(30, 20, 100, 50, 10, "rgb(255, 194, 194)");
let square2 = new Square(400, 20, 100, 50, 7, "rgb(0, 200, 200)");
let circle0 = new Circle(300, 300, 50, 90, 8, "rgb(255, 0, 0)");
let circle1 = new Circle(500, 500, 30, 5, 50, "rgb(0, 0, 0)"); //i should try acceleration here