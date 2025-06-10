// Conway's Game of Life with color evolution

let grid;
let cols;
let rows;
let cellSize = 20;
let colors = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  
  // Initialize grid with random states
  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = {
        alive: random() > 0.7,
        color: color(random(100, 255), random(100, 255), random(100, 255))
      };
    }
  }
}

function draw() {
  background(0, 20);
  
  // Draw current state
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].alive) {
        fill(grid[i][j].color);
        noStroke();
        rect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
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
          color: grid[i][j].color
        };
      } else if (!state && neighbors === 3) {
        // New cell born - inherit color from majority of neighbors
        nextGrid[i][j] = {
          alive: true,
          color: getNeighborColor(i, j)
        };
      } else {
        nextGrid[i][j] = {
          alive: state,
          color: grid[i][j].color
        };
      }
    }
  }
  
  grid = nextGrid;
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

function getNeighborColor(x, y) {
  let colors = [];
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i === 0 && j === 0) continue;
      
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      if (grid[col][row].alive) {
        colors.push(grid[col][row].color);
      }
    }
  }
  
  if (colors.length > 0) {
    // Average the colors of living neighbors
    let r = 0, g = 0, b = 0;
    for (let c of colors) {
      r += red(c);
      g += green(c);
      b += blue(c);
    }
    return color(r / colors.length, g / colors.length, b / colors.length);
  }
  
  return color(random(100, 255), random(100, 255), random(100, 255));
}

function mousePressed() {
  // Add new cells on click
  let col = floor(mouseX / cellSize);
  let row = floor(mouseY / cellSize);
  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    grid[col][row].alive = true;
    grid[col][row].color = color(random(100, 255), random(100, 255), random(100, 255));
  }
}