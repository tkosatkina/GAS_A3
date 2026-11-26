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