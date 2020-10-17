/*
 *  =============================================
 *  SOUNDBOARD SETUP
 *  =============================================
 */

/*
 *  RETRIEVE STRINGS
 *  ---------------------------------------------
 */

const stringFile = './strings.json';
const requestStrings = new XMLHttpRequest();

requestStrings.open('GET', stringFile);
requestStrings.responseType = 'json';
requestStrings.send();

requestStrings.onload = function() {
  const stringFile = requestStrings.response;
  createButtons(stringFile);
}

/*
 *  CREATE BUTTONS
 *  ---------------------------------------------
 */

const createButtons = function(stringFile) {
  const btnStrings = stringFile.buttonStrings;
  const soundboard = document.getElementById('soundboard');

  for (let i = 0; i < btnStrings.length; i++) {
    const newBtn = document.createElement('button');

    newBtn.textContent = btnStrings[i].label;
    newBtn.setAttribute('data-speech', btnStrings[i].speech);

    soundboard.appendChild(newBtn);
    newBtn.addEventListener('click', playSound, false);
  }
};

/*
 *  =============================================
 *  SOUNDBOARD FUNCTIONS
 *  =============================================
 */

/*
 *  PLAY SOUND
 *  ---------------------------------------------
 */

const playSound = function(e) {
  const speechString = e.target.getAttribute('data-speech');
  const speechify = new SpeechSynthesisUtterance(speechString);
  speechSynthesis.speak(speechify);
  console.log('test');
};