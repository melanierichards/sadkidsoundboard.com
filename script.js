/*
 *  =============================================
 *  GLOBALS
 *  =============================================
 */

const voicesEl = document.getElementById('voices');
const settingValueVoice = localStorage.getItem('setting-voice');

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
  const voiceOptions = window.speechSynthesis.getVoices();
  const selectedVoice = voicesEl.selectedOptions[0].getAttribute('data-name');

  for (let i = 0; i < voiceOptions.length; i++) {
    if (voiceOptions[i].name === selectedVoice) {
      speechify.voice = voiceOptions[i];
    }
  }

  speechSynthesis.speak(speechify);
};

/*
 *  =============================================
 *  SETTINGS
 *  =============================================
 */

/*
 *  SETTING: VOICE
 *  ---------------------------------------------
 */

// Present voice options
const listVoiceOptions = function() {
  const voiceOptions = window.speechSynthesis.getVoices();

  for (let i = 0; i < voiceOptions.length; i++) {
    const option = document.createElement('option');

    if (voiceOptions[i].default) {
      option.textContent += 'Default voice';
    } else {
      option.textContent = voiceOptions[i].name + ' (' + voiceOptions[i].lang + ')';
    }

    option.setAttribute('data-lang', voiceOptions[i].lang);
    option.setAttribute('data-name', voiceOptions[i].name);
    if (settingValueVoice && settingValueVoice === voiceOptions[i].lang) {
      option.setAttribute('selected', 'true');
    }
    voicesEl.appendChild(option);
  }
};

listVoiceOptions();

// Chromium needs onvoiceschanged to fire in order to populate; avoid re-populating
if (speechSynthesis.onvoiceschanged !== undefined) {
  if (voicesEl.options.length === 0) {
    speechSynthesis.onvoiceschanged = listVoiceOptions;
  }
}

// Store setting: voice
const storeVoiceSetting = function() {
  const selectedVoice = voicesEl.selectedOptions[0].getAttribute('data-lang');
  localStorage.setItem('setting-voice', selectedVoice);
};

voicesEl.addEventListener('change', storeVoiceSetting);