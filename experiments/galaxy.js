//Code adapted from example code in the Complexity slides
//Class created with the help of Claude ai
class CelestialBody {
    constructor(x, y, mass) {
      this.position = createVector(x, y);
      this.velocity = p5.Vector.random2D().mult(random(0.5, 2));
      this.acceleration = createVector(0, 0);
      this.mass = mass;
      this.size = map(mass, 1, 10, 1, 5);
      this.color = color(random(150, 25), random(150, 25), random(200, 25));
    }
  
    applyForce(force) {
      let f = p5.Vector.div(force, this.mass);
      this.acceleration.add(f);
    }
  
    update() {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(1);
    }
  
    draw() {
      noStroke();
      fill(this.color);
      ellipse(this.position.x, this.position.y, this.size);
    }
  }
  
  let bodies = [];
  let blackHole;
  const G = 0.01; // Gravitational constant
  
  function setup() {
    createCanvas(innerWidth, innerHeight);
    blackHole = new CelestialBody(width / 3, height / 2, 800);
    blackHole.color = color(0);
    blackHole.size = 20;
  
    for (let i = 0; i < 1600; i++) {
      let angle = random(TWO_PI);
      let radius = random(100, min(width, height) / 2);
      let x = width / 2 + cos(angle) * radius;
      let y = height / 2 + sin(angle) * radius;
      bodies.push(new CelestialBody(x, y, random(1, 5)));
    }
  }
  
  function draw() {
    background(0, 20);
  
    blackHole.draw();
    
    //loop created with the help of claude ai
    for (let body of bodies) {
      let force = p5.Vector.sub(blackHole.position, body.position);
      let distanceSq = force.magSq();
      let strength = (G * (blackHole.mass * body.mass)) / distanceSq;
      force.setMag(strength);
      body.applyForce(force);
  
      body.update();
      body.draw();
  
      // Wrap around edges
      body.position.x = (body.position.x + width) % width;
      body.position.y = (body.position.y + height) % height;
    }
  }