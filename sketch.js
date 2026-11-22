// Constants
SEED = 99; // Seed for random number generation
STAR_COUNT = 100; // Number of stars to draw

// Variables
let numOfStars;
let imgEarth;
let imgMoon;
let earthOrbitAng = 0;
let earthRotationAng = 0
let moonOrbitAng = 0;
let moonRotationAng = 0;

function preload() {
  imgEarth = loadImage('./assets/earth_daymap.jpg'); // Load the Earth texture image
  imgMoon = loadImage('./assets/moon.jpg'); // Load the Moon texture image
}

function setup() {
  createCanvas(700, 700, WEBGL);
}

let angle = 0;

function draw() {
  background(0);
  
  // Base Solar system
  drawStars();   
  
  // Weak ambient light to make the dark side slightly visible
  ambientLight(65);
  // Light emitted from the Sun
  pointLight(255, 255, 255, 0, 0, 0);
  
  drawSun();     
  drawEarth();    
  
}

/**
 * This function draws 100 stars in random positions on the canvas. 
 * Each star is represented as a small white circle.
 */
function drawStars() {
  randomSeed(SEED); // Set a seed for consistent star positions

  for (let i = 0; i < STAR_COUNT; i++) {
    let x = random(-width / 2, width / 2);
    let y = random(-height / 2, height / 2);
    //let z = random(-height / 2, height / 2);
    push();
    translate(x, y);
    normalMaterial(); // Use normal material for stars
    noStroke();
    sphere(1.5);    
    pop();
  }
}

/**
 * This function draws the sun in the center of the canvas.
 * The sun is represented as a yellow sphere.
 */
function drawSun() {
  push();
  emissiveMaterial(255, 204, 0); // Yellow color for the sun with the light comming from it
  noStroke();
  sphere(30); 
  pop();
}

/**
 * This function is intended to draw the Earth in the scene.
 * The Earth is represented as a sphere with a texture applied to it 
 * that rotates arouund its z-axis and around the sun.
 */
function drawEarth() {
  push(); 

  // Add rotations and positions to simulate the Earth's orbit around the sun and its own rotation
  rotateZ(angle); 
  translate(100, 0, 0); // Move the Earth to the right of the sun
  
  push();
  rotateY(angle * 2);

  // Apply the Earth texture
  texture(imgEarth); 
  noStroke();
  sphere(10);
  pop();

  // Add Moon relatively to Earth's position
  drawMoon();
  pop();

  angle += 0.01; // Increment the angle for rotation
}

/**
 * This function draws Moon orbiting around the Earth. 
 * The Moon is represented as a smaller sphere with a texture applied to it.
 */
function drawMoon() {
  push();

  rotateZ(angle * 2); // Rotate the moon around the Earth
  translate(20, 0, 0); // Move the Moon to the right of the Earth
  rotateY(angle * 4); // Rotate the Moon on its own axis

  // Apply the Moon texture
  texture(imgMoon);
  noStroke();
  sphere(3);

  pop();
}