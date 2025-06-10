// Rainbow Conway's Game of Life
// This code was created with the assistance of ChatGPT
// Used the code from the Game of Life example and modified it to use rainbow colors and different shapes using this as a reference: https://p5js.org/examples/shapes-and-color-shape-primitives/
let grid;
let cols;
let rows;
let cellSize = 20;
let rainbowColors = [];
let currentColorIndex = 0;

function setup() {
  createCanvas(innerWidth, innerHeight);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  
  // Create rainbow color palette
  for (let i = 0; i < 360; i += 60) {
    rainbowColors.push(color(
      map(sin(radians(i)), -1, 1, 0, 255),
      map(sin(radians(i + 120)), -1, 1, 0, 255),
      map(sin(radians(i + 240)), -1, 1, 0, 255)
    ));
  }
  
  // Initialize grid with random states
  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = {
        alive: random() > 0.7,
        color: rainbowColors[floor(random(rainbowColors.length))],
        shape: floor(random(4)) // 0: circle, 1: triangle, 2: star, 3: diamond
      };
    }
  }
}

function draw() {
  background(0, 20);
  
  // Slowly cycle colors
  if (frameCount % 30 === 0) {
    currentColorIndex = (currentColorIndex + 1) % rainbowColors.length;
  }
  
  // Draw current state
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].alive) {
        fill(grid[i][j].color);
        noStroke();
        
        let x = i * cellSize + cellSize/2;
        let y = j * cellSize + cellSize/2;
        let size = cellSize - 2;
        
        switch(grid[i][j].shape) {
          case 0: // Circle
            ellipse(x, y, size, size);
            break;
          case 1: // Triangle
            push();
            translate(x, y);
            rotate(frameCount * 0.02);
            triangle(-size/2, size/2, size/2, size/2, 0, -size/2);
            pop();
            break;
          case 2: // Star
            drawStar(x, y, size/2, size/4, 5);
            break;
          case 3: // Diamond
            push();
            translate(x, y);
            rotate(PI/4);
            rect(0, 0, size/1.5, size/1.5);
            pop();
            break;
        }
      }
    }
  }
  
  // Compute next generation
  let nextGrid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    nextGrid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      let neighbors = countNeighbors(i, j);
      let state = grid[i][j].alive;
      
      // Apply Conway's rules
      if (state && (neighbors < 2 || neighbors > 3)) {
        nextGrid[i][j] = {
          alive: false,
          color: grid[i][j].color,
          shape: grid[i][j].shape
        };
      } else if (!state && neighbors === 3) {
        // New cell born - use current rainbow color and random shape
        nextGrid[i][j] = {
          alive: true,
          color: rainbowColors[currentColorIndex],
          shape: floor(random(4))
        };
      } else {
        nextGrid[i][j] = {
          alive: state,
          color: grid[i][j].color,
          shape: grid[i][j].shape
        };
      }
    }
  }
  
  grid = nextGrid;
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function countNeighbors(x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i === 0 && j === 0) continue;
      
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row].alive ? 1 : 0;
    }
  }
  return sum;
}

function mousePressed() {
  // Add new cells on click
  let col = floor(mouseX / cellSize);
  let row = floor(mouseY / cellSize);
  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    grid[col][row].alive = true;
    grid[col][row].color = rainbowColors[currentColorIndex];
    grid[col][row].shape = floor(random(4));
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
} 