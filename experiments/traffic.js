class Vehicle {
    constructor(x, y) {
      this.position = createVector(x, y);
      this.velocity = createVector(random(-2, 2), random(-2, 2));
      this.acceleration = createVector(0, 0);
      this.maxSpeed = random(2, 4);
      this.maxForce = 0.2;
      this.size = random(4, 8);
      this.color = color(random(100, 255), random(100, 255), random(100, 255));
    }
  
    follow(desired) {
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    }
  
    applyForce(force) {
      this.acceleration.add(force);
    }
  
    update() {
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
    }
  
    checkEdges() {
      if (this.position.x > width) this.position.x = 0;
      if (this.position.x < 0) this.position.x = width;
      if (this.position.y > height) this.position.y = 0;
      if (this.position.y < 0) this.position.y = height;
    }
  
    draw() {
      push();
      translate(this.position.x, this.position.y);
      rotate(this.velocity.heading());
      fill(this.color);
      noStroke();
      triangle(-this.size, -this.size/2, -this.size, this.size/2, this.size, 0);
      pop();
    }
  }
  
  let vehicles = [];
  let flowField;
  let cols, rows;
  let resolution = 20;
  
  function setup() {
    createCanvas(innerWidth, innerHeight);
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    flowField = generateFlowField();
    
    for (let i = 0; i < 200; i++) {
      vehicles.push(new Vehicle(random(width), random(height)));
    }
  }
  
  function generateFlowField() {
    let field = new Array(cols);
    for (let i = 0; i < cols; i++) {
      field[i] = new Array(rows);
      for (let j = 0; j < rows; j++) {
        let angle = noise(i * 0.1, j * 0.1) * TWO_PI * 2;
        field[i][j] = p5.Vector.fromAngle(angle);
      }
    }
    return field;
  }
  
  function drawRoads() {
    stroke(50);
    strokeWeight(1);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;
        line(x, y, x + flowField[i][j].x * resolution, y + flowField[i][j].y * resolution);
      }
    }
  }
  
  function draw() {
    background(0);
    drawRoads(7);
  
    for (let vehicle of vehicles) {
      let x = floor(vehicle.position.x / resolution);
      let y = floor(vehicle.position.y / resolution);
      x = constrain(x, 0, cols - 1);
      y = constrain(y, 0, rows - 1);
      let desired = flowField[x][y].copy();
      vehicle.follow(desired);
      vehicle.update();
      vehicle.checkEdges();
      vehicle.draw();
    }
  }