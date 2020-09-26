/*
 *  =============================================
 *  SOUNDBOARD SETUP
 *  =============================================
 */

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
  let speechString = e.target.getAttribute('data-speech');
  let speechify = new SpeechSynthesisUtterance(speechString);
  speechSynthesis.speak(speechify);
};

let soundboardButtons = document.querySelectorAll('.soundboard button');

soundboardButtons.forEach(function(soundboardButton){
  soundboardButton.addEventListener('click', playSound, false);
});