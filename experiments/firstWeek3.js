let dotSize = 20;
let spacing = 40;
let noiseScale = 0.8;
let connectionNoiseScale = 0.05;

function setup() {
  createCanvas(800, 800);
  background(255);
  
  //Create an array to store dot positions
  //The array was created with the help of Claude ai
  let dots = [];
  
  for (let x = spacing / 2; x < width; x += spacing) {
    for (let y = spacing / 2; y < height; y += spacing) {
      let metroLine = checkIfMetroLine(x, y, noiseScale);
      
      //Store dot information
      dots.push({x: x, y: y, line: metroLine});
      
      //Draw dots
      if (metroLine === 1) {
        fill(255, 0, 0);  //Red for Line 1
      } else if (metroLine === 2) {
        fill(0, 0, 255);  //Blue for Line 2
      } else if (metroLine === 3) {
        fill(0, 255, 0);  //Green for Line 3
      } else {
        fill(255);
        stroke(0, 0, 0);
      }
      
      ellipse(x, y, dotSize, dotSize);
    }
  }
  
  //Draw connections
  drawConnections(dots);
}

function checkIfMetroLine(x, y, noiseScale) {
  let line1Path = noise(x * noiseScale) * height;
  let line2Path = noise(x * noiseScale + 100) * height;
  let line3Path = noise(x * noiseScale + 150) * height;
  
  let threshold = 15;
  
  if (abs(y - line1Path) < threshold) {
    return 1; //Line 1 (red)
  } else if (abs(y - line2Path) < threshold) {
    return 2; //Line 2 (blue)
  } else if (abs(y - line3Path) < threshold) {
    return 3; //Line 3 (green)
  }
  
  return 0; //Not part of a metro line
}

//The drawing of the connections was created with the help of Claude Ai to understand the logic
function drawConnections(dots) {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      let dot1 = dots[i];
      let dot2 = dots[j];
      
      //Use Perlin noise to determine if dots should be connected
      let shouldConnect = noise(dot1.x * connectionNoiseScale, dot1.y * connectionNoiseScale, 
                                dot2.x * connectionNoiseScale, dot2.y * connectionNoiseScale) > 0.6;
      
      if (shouldConnect && dot1.line !== 0 && dot2.line !== 0) {
        //Set stroke color based on the metro lines of the dots
        if (dot1.line === dot2.line) {
          // ame line, use the line's color
          if (dot1.line === 1) stroke(255, 0, 0, 250);
          else if (dot1.line === 2) stroke(0, 0, 255, 250);
          else stroke(0, 255, 0, 250);
        } else {
          //Different lines, use a neutral color
          stroke(0, 0);
        }
        
        //Draw the connection
        line(dot1.x, dot1.y, dot2.x, dot2.y);
      }
    }
  }
}