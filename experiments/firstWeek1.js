function setup() {
  createCanvas(800, 800);
  background(255); 
  
  let dotSize = 20;     
  let spacing = 40;      
  
  let noiseScale = 0.3;   //Scale for Perlin noise

  for (let x = spacing / 2; x < width; x += spacing) {
    for (let y = spacing / 2; y < height; y += spacing) {
      let d = dotSize;

      //Check if this dot is on a metro line
      let metroLine = checkIfMetroLine(x, y, noiseScale);

      if (metroLine === 1) {
        fill(255, 0, 0);  //Red for Line 1
      } else if (metroLine === 2) {
        fill(0, 0, 255);  //Blue for Line 2
      } else if (metroLine === 3) {
        fill(0, 255, 0);   //Green for Line 3
      } else {
        fill(0);
      }

      noStroke();

      ellipse(x, y, d, d);  //Draw a circle (dot) at (x, y)
    }
  }
}

//The following code was adapted from Garrit's code using the help of ChatGPT to understand the logic

function checkIfMetroLine(x, y, noiseScale) {
  //Function to determine if a dot is part of a metro line
  let line1Path = noise(x * noiseScale) * height;
  let line2Path = noise(x * noiseScale + 100) * height;
  let line3Path = noise(x * noiseScale + 150) * height;

  //Apply some threshold to determine if the dot is close enough to the line
  let threshold = 15;

  if (abs(y - line1Path) < threshold) {
    return 1; // Line 1 (red)
  } else if (abs(y - line2Path) < threshold) {
    return 2; // Line 2 (blue)
  } else if (abs(y - line3Path) < threshold) {
    return 3; // Line 2 (blue)
  }

  return 0; //Not part of a metro line
}

