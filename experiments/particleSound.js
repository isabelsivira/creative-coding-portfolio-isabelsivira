//The following code was created and adapted with the assistance of Claude.ai. 
//The idea is based on the Particles assignment during the Foundations of Programming course during the fall term of 2023.
let synth;
let amplitude;
let particles = [];

function setup() {
  createCanvas(800, 600);
  
  //Troubleshooting
  if (typeof Tone === 'undefined') {
    console.error('Tone is not defined. Make sure you have included the Tone.js library in your HTML file.');
    return;
  }
  
  synth = new Tone.Synth().toDestination();
  amplitude = new Tone.Meter();
  synth.connect(amplitude);
  
  let startButton = createButton('Start Audio');
  startButton.mousePressed(() => {
    Tone.start().then(() => {
      console.log('Audio is ready');
    }).catch(error => {
      console.error('Error starting audio:', error);
    });
  });
}

function draw() {
background(0, 0, 0);
  
  if (!amplitude) return;
  
  let level = amplitude.getValue();
  
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(level);
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

function mousePressed() {
  if (!synth) return;
  
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let note = ["C4", "D4", "E4", "G4", "A4"][floor(random(5))];
    synth.triggerAttackRelease(note, "8n");
    
    //Generate multiple particles
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  }
}

class Particle {
    constructor(x, y) {
      this.position = createVector(x, y);
      this.velocity = p5.Vector.random2D().mult(random(1, 3));
      this.acceleration = createVector(0, 0.05);
      this.lifespan = 255;
      this.baseSize = random(2, 8);
      this.size = this.baseSize;
      this.color = color(random(255), random(255), random(255));
    }
    
    update(level) {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.lifespan -= 2;
      
      // Adjust size based on audio level, but limit the maximum size
      let sizeMultiplier = map(level, -100, 0, 0.5, 2);
      this.size = constrain(this.baseSize * sizeMultiplier, 1, 20);
    }
    
    display() {
      noStroke();
      fill(red(this.color), green(this.color), blue(this.color), this.lifespan);
      ellipse(this.position.x, this.position.y, this.size, this.size);
    }
    
    isDead() {
      return this.lifespan < 0;
    }
  }