// Autonomous Agents inspired by Carlos Cruz-Diez's Physichromie series
// This code was created with the assistance of ChatGPT
class ColorAgent {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(1, 3));
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.2;
    this.color = color(
      random(200, 255),
      random(200, 255),
      random(200, 255),
      150
    );
    this.size = random(15, 30);
    this.angle = 0;
    this.angleVel = random(-0.05, 0.05);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    // Update position
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    // Update angle
    this.angle += this.angleVel;

    // Wrap around edges
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    
    // Draw a geometric shape with the agent's color
    noStroke();
    fill(this.color);
    
    // Draw a series of rectangles that create a moiré effect
    for (let i = 0; i < 5; i++) {
      rect(-this.size/2, -this.size/2 + i * (this.size/4), 
           this.size, this.size/8);
    }
    pop();
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }

  avoid(target) {
    let desired = p5.Vector.sub(this.position, target);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }
}

let agents = [];
let mouseTarget;

function setup() {
  createCanvas(innerWidth, innerHeight);
  colorMode(RGB, 255, 255, 255, 255);
  
  // Create agents
  for (let i = 0; i < 50; i++) {
    agents.push(new ColorAgent(
      random(width),
      random(height)
    ));
  }
  
  mouseTarget = createVector(width/2, height/2);
}

function draw() {
  background(0, 20);
  
  // Update mouse target
  mouseTarget.x = mouseX;
  mouseTarget.y = mouseY;
  
  // Update and draw agents
  for (let agent of agents) {
    // Create flocking behavior
    let seekForce = agent.seek(mouseTarget);
    agent.applyForce(seekForce);
    
    // Add some random movement
    if (random() < 0.05) {
      agent.applyForce(p5.Vector.random2D().mult(0.1));
    }
    
    agent.update();
    agent.draw();
  }
}

function mousePressed() {
  // Add new agents on click
  for (let i = 0; i < 5; i++) {
    agents.push(new ColorAgent(mouseX, mouseY));
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
} 