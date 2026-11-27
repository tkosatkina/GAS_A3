// Create GUI object
let gui = {};

/**
 * This function creates GUI for the base Solar System
 */
function createBaseGui() {
    
  // Stars controls
    createSpan('Number of stars: ').parent('stars-controls');
    gui.starInput = createInput(String(STAR_COUNT));
    gui.starInput.parent('stars-controls');
    gui.starButton = createButton('Update stars');
    gui.starButton.parent('stars-controls');
    gui.starButton.mousePressed(updateStars);

    // Earth controls
    gui.earthDistance = addSlider('earth-moon-controls', 'Earth distance from the Sun', 80, 300, EARTH_DIST, 1);
    gui.earthSpeed = addSlider('earth-moon-controls', 'Earth rotation Speed', 0, 0.1, EARTH_SPEED, 0.001);

    // Moon controls
    gui.moonDistance = addSlider('earth-moon-controls', 'Moon distance from the Earth', 15, 60, MOON_DIST, 1);
    gui.moonSpeed = addSlider('earth-moon-controls', 'Moon rotation Speed', 0, 0.2, MOON_SPEED, 0.001);
}

/**
 * Helper function that creates a labelled slider inside a specified HTML container.
 */
function addSlider(parentId, label, min, max, defaultValue, step) {
    let container = createDiv();
    container.parent(parentId);
    container.addClass('control');

    // Create label
    let text = createSpan(label + ': ' + defaultValue);
    text.parent(container);

    // Create slider
    let slider = createSlider(min, max, defaultValue, step);
    slider.parent(container);

    // Update displayed value when slider moves
    slider.input( () => {
        text.html(label + ': ' + slider.value());
    });

    return slider;
}

/**
 * Function that takes user input and handles Update Stars button event
 */
function updateStars() {
  let input = gui.starInput.value().trim();
  let count = Number(input);

  if (input !== '' &&
      Number.isInteger(count) &&
      count >= 0 && count <= 1000) {
    generateStars(count);
  } else {
    alert('Enter a whole number between 0 and 1000.');
  }
}

/**
 * Creates GUI controls for additional planets and moons.
 */
function createAdditionalGui() {
  let parentId = 'planet-controls';

  // Planet parameters
  gui.planetRadius = addSlider(parentId, 'Planet radius', 5, 30, PLANET_RADIUS, 1);

  let colorContainer = createDiv();
  colorContainer.parent(parentId);
  colorContainer.addClass('control');
  createSpan('Planet color: ').parent(colorContainer);

  gui.planetColor = createColorPicker(PLANET_COLOR);
  gui.planetColor.parent(colorContainer);

  // Create predefined color options
  createColorPalette(colorContainer);

  gui.planetDistance = addSlider(parentId, 'Distance from the Sun', 50, 300, PLANET_DIST, 1);

  gui.planetSpeed = addSlider(parentId, 'Planet orbital speed', 0, 0.1, PLANET_SPEED, 0.001);

  // Optional moon
  gui.hasMoon = createCheckbox('Add a moon', PLANET_HAS_MOON);
  gui.hasMoon.parent(parentId);

  // Moon parameters
  gui.planetMoonRadius = addSlider(parentId, 'Moon radius', 2, 10, PLANET_MOON_RADIUS, 1);

  gui.planetMoonDistance = addSlider(parentId, 'Moon distance from the Planet', 10, 60, PLANET_MOON_DIST, 1);

  gui.planetMoonSpeed = addSlider(parentId, 'Moon orbital speed', 0, 0.2, PLANET_MOON_SPEED, 0.001);

  // Toggle moon controls
  gui.hasMoon.changed(toggleMoonControls);
  toggleMoonControls();

    
  // Add planet button
  gui.addPlanetBtn = createButton('Add planet');
  gui.addPlanetBtn.parent(parentId);
  gui.addPlanetBtn.mousePressed(addPlanet);
}

/**
 * This function enables or disables Moon configuration controls.
 */
function toggleMoonControls() {
    let controls = [ gui.planetMoonRadius,
                      gui.planetMoonDistance,
                      gui.planetMoonSpeed ];

    for (let control of controls) {
        if (gui.hasMoon.checked()) {
            control.removeAttribute('disabled');
        } else {
            control.attribute('disabled', '');
        }
    }
}

/**
 * This function takes planet's parameters and handles Add Planet button press event
 */
function addPlanet() {
  // Planet object
  let planet = {
    radius: gui.planetRadius.value(),
    color: gui.planetColor.value(),
    distance: gui.planetDistance.value(),
    orbitSpeed: gui.planetSpeed.value(),
    orbitAngle: 0,

    hasMoon: gui.hasMoon.checked(),
    moonRadius: gui.planetMoonRadius.value(),
    moonDistance: gui.planetMoonDistance.value(),
    moonOrbitSpeed: gui.planetMoonSpeed.value(),
    moonOrbitAngle: 0
  };

  // Prevent the planet from overlapping the Sun
  if (planet.distance <= SUN_RADIUS + planet.radius) {
    alert('The planet is too close to the Sun.');
    return;
  }

  // Prevent the Moon from overlapping the planet
  if (planet.hasMoon && planet.moonDistance <= planet.radius + planet.moonRadius) {
    alert('The Moon is too close to the planet.');
    return;
  }

  planets.push(planet);
}

/**
 * This function creates a palette of predefined colors for additional planets.
*/
function createColorPalette(parent) {
  let palette = createDiv();
  palette.parent(parent);
  palette.addClass('color-palette');

  for(let planetColor of PLANET_COLORS) {
    let swatch = createButton('');
    swatch.parent(palette);
    swatch.addClass('color-swatch');
    swatch.style('background-color', planetColor);
    swatch.attribute('title', planetColor);

    // Update the color picker when a swatch is clicked
    swatch.mousePressed( () => {
      gui.planetColor.value(planetColor);
    });
  }
}

/**
 * This function creates GUI controls for managing the solar system.
 */
function createSimulationGui() {
  let parentId = 'simulation-controls';

  // remove last added planet
  gui.removePlanetBtn = createButton('Remove last planet');
  gui.removePlanetBtn.parent(parentId);
  gui.removePlanetBtn.mousePressed(removeLastPlanet);

  // Pause and resume rotations
  gui.pauseBtn = createButton('Pause rotation');
  gui.pauseBtn.parent(parentId);
  gui.pauseBtn.mousePressed(togglePause);

  // Reset the simulation
  gui.resetBtn = createButton('Reset');
  gui.resetBtn.parent(parentId);
  gui.resetBtn.mousePressed(resetProgram);
}

/**
 * Helper function that resets slider and displayed value.
 */
function resetSlider(slider, defaultValue) {
  slider.value(defaultValue);
  slider.elt.dispatchEvent(new Event('input'));
}

/**
 * Resets the simulation and all GUI controls.
 */
function resetProgram() {
  resetSimulation();

  // Reset stars
  gui.starInput.value(String(STAR_COUNT));

  // Reset Earth controls
  resetSlider(gui.earthDistance, EARTH_DIST);
  resetSlider(gui.earthSpeed, EARTH_SPEED);

  // Reset Moon controls
  resetSlider(gui.moonDistance, MOON_DIST);
  resetSlider(gui.moonSpeed, MOON_SPEED);

  // Reset additional planet controls
  resetSlider(gui.planetRadius, PLANET_RADIUS);
  resetSlider(gui.planetDistance, PLANET_DIST);
  resetSlider(gui.planetSpeed, PLANET_SPEED);
  gui.planetColor.value(PLANET_COLOR);

  // Reset optional moon controls
  gui.hasMoon.checked(PLANET_HAS_MOON);
  resetSlider(gui.planetMoonRadius, PLANET_MOON_RADIUS);
  resetSlider(gui.planetMoonDistance, PLANET_MOON_DIST);
  resetSlider(gui.planetMoonSpeed, PLANET_MOON_SPEED);

  toggleMoonControls();

  // Reset pause button label
  gui.pauseBtn.html('Pause rotation');
}