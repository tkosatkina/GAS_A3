/**
 * Project:     Assignment 3 
 * Prepared by: Tatiana Kosatkina (8914510)
 * Course:      SENG3040 - Graphics, Animation, and Sound
 * Date:        November 27, 2026
 * 
 * 
 * Description: This code is 
 */

// Constants
const SEED = 99; // Seed for random number generation
const STAR_COUNT = 100; // Default state
const STAR_RADIUS = 1.5;
const SUN_RADIUS = 30;
const EARTH_RADIUS = 10;
const EARTH_DIST = 100;
const EARTH_SPEED = 0.01;
const MOON_RADIUS = 3;
const MOON_DIST = 20;
const MOON_SPEED = 0.02;

// Variables
let imgEarth;
let imgMoon;

let earthOrbitAng = 0;
let earthRotationAng = 0;
let moonOrbitAng = 0;
let moonRotationAng = 0;

let stars = [];
let planets = [];

let isPaused = false; 


function preload() {
  imgEarth = loadImage('./assets/earth_daymap.jpg'); // Load the Earth texture image
  imgMoon = loadImage('./assets/moon.jpg'); // Load the Moon texture image
}

function setup() {
  let canvas = createCanvas(700, 700, WEBGL);
  canvas.parent('canvas-container');

  randomSeed(SEED); // Set a seed for consistent star positions
  generateStars(STAR_COUNT);
  createBaseGui();
}



function draw() {
  background(0);
  
  // Base Solar system
  drawStars(stars);  
  
  ambientLight(100);                    // Ambient light to make the dark side visible
  pointLight(255, 255, 255, 0, 0, 0);   // Light emitted from the Sun
  
  // Read GUI values
  let earthDistance = gui.earthDistance.value();
  let earthSpeed = gui.earthSpeed.value();

  let moonDistance = gui.moonDistance.value();
  let moonSpeed = gui.moonSpeed.value();

  // Update rotation
  updateRotation(earthSpeed, moonSpeed);

  drawSun();
  drawEarth(earthDistance, earthOrbitAng, earthRotationAng, moonDistance, moonOrbitAng, moonRotationAng);    
}

/**
 * This function generates stars and stores them in array
 */
function generateStars(count) {
  stars = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: random(-width / 2, width / 2),
      y: random(-height / 2, height / 2)
    });
  }
}

/**
 * This function draws stars using previously generated positions. 
 * Each star is represented as a small rainbow color circle.
 */
function drawStars(stars) {
  for (let star of stars) {
    push();
    translate(star.x, star.y);
    normalMaterial(); // Use normal material for stars
    noStroke();
    sphere(STAR_RADIUS);    
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
  sphere(SUN_RADIUS); 
  pop();
}

/**
 * This function is intended to draw the Earth in the scene.
 * The Earth is represented as a sphere with a texture applied to it 
 * that rotates arouund its z-axis and around the sun.
 */
function drawEarth(distance, orbitAng, rotationAng, moonDistance, moonOrbit, moonRotation) {
  push(); 

  // Add rotations and positions to simulate the Earth's orbit around the sun and its own rotation
  rotateZ(orbitAng); 
  translate(distance, 0, 0); // Move the Earth to the right of the sun
  
  push();
  rotateY(rotationAng);

  // Apply the Earth texture
  texture(imgEarth); 
  noStroke();
  sphere(EARTH_RADIUS);
  pop();

  // Add Moon relatively to Earth's position
  drawMoon(moonDistance, moonOrbit, moonRotation);
  pop();
}

/**
 * This function draws Moon orbiting around the Earth. 
 * The Moon is represented as a smaller sphere with a texture applied to it.
 */
function drawMoon(distance, orbitAng, rotationAng) {
  push();

  rotateZ(orbitAng); // Rotate the moon around the Earth
  translate(distance, 0, 0); // Move the Moon to the right of the Earth
  rotateY(rotationAng); // Rotate the Moon on its own axis

  // Apply the Moon texture
  texture(imgMoon);
  noStroke();
  sphere(MOON_RADIUS);

  pop();
}

/**
 * This function updates orbital and axial rotation angles unless the simulation is paused.
 */
function updateRotation(earthSpeed, moonSpeed) {
  if(isPaused) {
    return;
  }

  // Rotate the Earth
  earthOrbitAng += earthSpeed;
  earthRotationAng += earthSpeed * 2;

  // Rotate the Moon
  moonOrbitAng += moonSpeed;
  moonRotationAng += moonSpeed * 2;
}