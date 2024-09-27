//Solar System Simulation
class CelestialBody {
  constructor(x, y, mass, color) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(0.5, 2));
    this.acceleration = createVector(0, 0);
    this.mass = mass;
    this.size = map(mass, 1, 1000, 2, 20);
    this.color = color;
    this.orbitPath = [];
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    
    //Store orbit path
    if (this.orbitPath.length > 100) {
      this.orbitPath.shift();
    }
    this.orbitPath.push(this.position.copy());
  }

  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.size);
    
    // Draw orbit path
    stroke(this.color);
    strokeWeight(0.5);
    noFill();
    beginShape();
    for (let pos of this.orbitPath) {
      vertex(pos.x, pos.y);
    }
    endShape();
  }
}

let star;
let planets = [];
let moons = [];
const G = 0.1; //Gravitational constant

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //Create star
  star = new CelestialBody(width / 2, height / 2, 1000, color(255, 204, 0));
  
  //Creation of planets and moons was made consulting Claude ai
  //Create planets
  for (let i = 0; i < 5; i++) {
    let distance = random(100, min(width, height) / 3);
    let angle = random(TWO_PI);
    let x = width / 2 + cos(angle) * distance;
    let y = height / 2 + sin(angle) * distance;
    let planetColor = color(random(100, 255), random(100, 255), random(100, 255));
    planets.push(new CelestialBody(x, y, random(10, 50), planetColor));
    
    //Create moons for each planet
    for (let j = 0; j < random(1, 4); j++) {
      let moonDistance = random(20, 30);
      let moonAngle = random(TWO_PI);
      let moonX = x + cos(moonAngle) * moonDistance;
      let moonY = y + sin(moonAngle) * moonDistance;
      let moonColor = color(planetColor.levels[0] * 0.4, planetColor.levels[1] * 0.4, planetColor.levels[2] * 0.4);
      moons.push({
        body: new CelestialBody(moonX, moonY, random(1, 5), moonColor),
        planet: planets[planets.length - 1]
      });
    }
  }
}

function draw() {
  background(0, 10);
  
  star.draw();
  
  for (let planet of planets) {
    let force = p5.Vector.sub(star.position, planet.position);
    let distanceSq = force.magSq();
    let strength = (G * (star.mass * planet.mass)) / distanceSq;
    force.setMag(strength);
    planet.applyForce(force);
    
    planet.update();
    planet.draw();
  }
  
  for (let moon of moons) {
    let force = p5.Vector.sub(moon.planet.position, moon.body.position);
    let distanceSq = force.magSq();
    let strength = (G * (moon.planet.mass * moon.body.mass)) / distanceSq;
    force.setMag(strength);
    moon.body.applyForce(force);
    
    moon.body.update();
    moon.body.draw();
  }
}
