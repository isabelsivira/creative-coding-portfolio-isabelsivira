let particles = [];
let noiseScale = 0.01;
let noiseStrength = 50;
let synth;
let reverb;
let currentNote = 0;
let notes = ['C4', 'E4', 'G4', 'B4', 'D5']; // Pentatonic scale
let isInitialized = false;

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 5;
    this.color = color(
      random(100, 255),
      random(100, 255),
      random(100, 255),
      150
    );
    this.size = random(5, 15);
    this.noiseOffset = random(1000);
    this.noteIndex = floor(random(notes.length));
    this.lastPlayed = 0;
    this.playInterval = random(300, 700);
  }

  update() {
    let angle = noise(
      this.position.x * noiseScale,
      this.position.y * noiseScale,
      frameCount * 0.001
    ) * TWO_PI * 2;

    let noiseVal = noise(
      this.position.x * noiseScale * 0.5,
      this.position.y * noiseScale * 0.5,
      frameCount * 0.0005
    );

    this.acceleration = p5.Vector.fromAngle(angle).mult(0.4);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;

    if (millis() - this.lastPlayed > this.playInterval) {
      if (noiseVal > 0.55) {
        playNote(this.noteIndex, noiseVal);
        this.lastPlayed = millis();
        this.playInterval = random(5000, 12000);
      }
    }

    this.size = map(noiseVal, 0, 1, 5, 12);
  }

  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.size);
  }
}

async function setupAudio() {
  try {
    await Tone.start();

    // Add reverb effect
    reverb = new Tone.Reverb({
      decay: 3,
      preDelay: 0.1,
      wet: 0.4
    }).toDestination();

    // Create a single polyphonic synth connected to reverb
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.3,
        release: 1.5
      }
    }).connect(reverb);

    isInitialized = true;
    console.log("Audio initialized successfully");
  } catch (e) {
    console.log("Audio initialization failed:", e);
  }
}

function playNote(noteIndex, velocity) {
  if (!isInitialized) return;

  try {
    let duration = map(velocity, 0, 1, 1, 3);
    let vel = map(velocity, 0, 1, 0.2, 0.8); // dynamic velocity (loudness)
    synth.triggerAttackRelease(notes[noteIndex], duration, undefined, vel);
  } catch (e) {
    console.log("Note playing failed:", e);
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);

  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(0, 20);

  for (let particle of particles) {
    particle.update();
    particle.draw();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = p5.Vector.dist(particles[i].position, particles[j].position);

      if (d < 100) {
        stroke(
          particles[i].color.levels[0],
          particles[i].color.levels[1],
          particles[i].color.levels[2],
          map(d, 0, 100, 30, 0)
        );
        strokeWeight(map(d, 0, 100, 0.5, 0));
        line(
          particles[i].position.x,
          particles[i].position.y,
          particles[j].position.x,
          particles[j].position.y
        );
      }
    }
  }
}

async function mousePressed() {
  if (!isInitialized) {
    await setupAudio();
  }

  particles.push(new Particle(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}
