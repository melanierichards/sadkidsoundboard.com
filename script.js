/*
 *  =============================================
 *  GLOBALS
 *  =============================================
 */

const captionsStoreEl = document.getElementById('captionsStore');

const voicesEl = document.getElementById('voices');
const captionsEl = document.getElementById('showCaptions');
const additionalCaptionEls = document.querySelectorAll('.settings__additional-caption');
const captionPosEls = document.querySelectorAll('input[name="captionPos"]');
const captionTimeEl = document.getElementById('captionTime');

const settingValueVoice = localStorage.getItem('setting-voice');

/*
 *  =============================================
 *  SOUNDBOARD SETUP
 *  =============================================
 */

/*
 *  ---------------------------------------------
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
 *  ---------------------------------------------
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
 *  ---------------------------------------------
 *  PLAY SOUND
 *  ---------------------------------------------
 */

const playSound = function(e) {
  const speechString = e.target.getAttribute('data-speech');
  const speechify = new SpeechSynthesisUtterance(speechString);
  const voiceOptions = window.speechSynthesis.getVoices();
  const selectedVoice = voicesEl.selectedOptions[0].getAttribute('data-name');
  const settingValueCaptions = localStorage.getItem('setting-captions');

  for (let i = 0; i < voiceOptions.length; i++) {
    if (voiceOptions[i].name === selectedVoice) {
      speechify.voice = voiceOptions[i];
    }
  }

  // Speak the string
  speechSynthesis.speak(speechify);

  // Show caption if applicable
  if (settingValueCaptions && settingValueCaptions === 'true') {
    showCaption(speechString);
  }
};

/*
 *  ---------------------------------------------
 *  SHOW CAPTION
 *  ---------------------------------------------
 */

const showCaption = function(captionText) {
  const settingValueCaptionTime = localStorage.getItem('setting-caption-time');
  const caption = document.createElement('p');
  caption.classList.add('c-caption');
  caption.textContent = captionText;

  if (captionsStoreEl.firstChild) {
    captionsStoreEl.firstChild.remove();
  }
  captionsStoreEl.appendChild(caption);

  setTimeout(() => {
    caption.remove();
  }, parseInt(settingValueCaptionTime) * 100);

  console.log(parseInt(settingValueCaptionTime) * 100);
};

/*
 *  =============================================
 *  SETTINGS
 *  =============================================
 */

/*
 *  ---------------------------------------------
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

/*
 *  ---------------------------------------------
 *  SETTING: CAPTIONS
 *  ---------------------------------------------
 */

const showAdditionalCaptionSettings = function() {
  additionalCaptionEls.forEach(function(setting) {
    setting.style.display = 'block';
  });
};

const hideAdditionalCaptionSettings = function() {
  additionalCaptionEls.forEach(function(setting) {
    setting.style.display = 'block';
  });
};

// Set up caption settings on page load
const setUpCaptionSettings = function() {
  const settingValueCaptions = localStorage.getItem('setting-captions');
  const settingValueCaptionPos = localStorage.getItem('setting-caption-pos');
  const settingValueCaptionTime = localStorage.getItem('setting-caption-time');

  if (settingValueCaptions === 'true') {
    captionsEl.checked = true;
    showAdditionalCaptionSettings();
  }

  if (settingValueCaptionPos) {
    document.querySelector('input[value="' + settingValueCaptionPos + '"]').checked = true;
    captionsStoreEl.setAttribute('data-pos', settingValueCaptionPos);
  } else {
    document.getElementById('captionPosBottom').checked = true;
  }
  
  if (settingValueCaptionTime) {
    captionTimeEl.value = settingValueCaptionTime;
  } else {
    localStorage.setItem('setting-caption-time', captionTimeEl.value);
  }
};

setUpCaptionSettings();

// Toggle captions on/off
const toggleCaptionSettings = function(e) {
  if (e.target.checked) {
    localStorage.setItem('setting-captions', 'true');
    showAdditionalCaptionSettings();
  } else {
    localStorage.setItem('setting-captions', 'false');
    hideAdditionalCaptionSettings();
  }
};

captionsEl.addEventListener('change', toggleCaptionSettings);

// Change caption position
const changeCaptionPos = function(e) {
  if (e.target.checked) {
    localStorage.setItem('setting-caption-pos', e.target.value);
    captionsStoreEl.setAttribute('data-pos', e.target.value);
  }
};

captionPosEls.forEach(function(e) {
  e.addEventListener('change', changeCaptionPos);
});

// Change caption timeout
const changeCaptionTime = function(e) {
  if (e.target.value !== '') {
    localStorage.setItem('setting-caption-time', captionTimeEl.value);
  }
}

captionTimeEl.addEventListener('change', changeCaptionTime);