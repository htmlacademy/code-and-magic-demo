import {getRandomArrayElement} from './util.js';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 25;

const Colors = {
  FIREBALL: [
    '#ee4830',
    '#30a8ee',
    '#5ce6c0',
    '#e848d5',
    '#e6e848',
  ],
  EYES: [
    'black',
    'red',
    'blue',
    'yellow',
    'green',
  ],
  COAT: [
    'rgb(101, 137, 164)',
    'rgb(241, 43, 107)',
    'rgb(146, 100, 161)',
    'rgb(56, 159, 117)',
    'rgb(215, 210, 55)',
    'rgb(0, 0, 0)',
  ],
};

const wizardSetupForm = document.querySelector('.setup-wizard-form');
const userNameInput = wizardSetupForm.querySelector('.setup-user-name');
const fireballColorElement = wizardSetupForm.querySelector('.setup-fireball-wrap');
const eyesColorElement = wizardSetupForm.querySelector('.wizard-eyes');
const coatColorElement = wizardSetupForm.querySelector('.wizard-coat');
const fireballColorInput = wizardSetupForm.querySelector('[name="fireball-color"]');
const eyesColorInput = wizardSetupForm.querySelector('[name="eyes-color"]');
const coatColorInput = wizardSetupForm.querySelector('[name="coat-color"]');

if (userNameInput) {
  userNameInput.addEventListener('invalid', () => {
    if (userNameInput.validity.valueMissing) {
      userNameInput.setCustomValidity('Обязательное поле');
    } else {
      userNameInput.setCustomValidity('');
    }
  });

  userNameInput.addEventListener('input', () => {
    const valueLength = userNameInput.value.length;

    if (valueLength < MIN_NAME_LENGTH) {
      userNameInput.setCustomValidity(`Ещё ${MIN_NAME_LENGTH - valueLength} симв.`);
    } else if (valueLength > MAX_NAME_LENGTH) {
      userNameInput.setCustomValidity(`Удалите лишние ${valueLength - MAX_NAME_LENGTH} симв.`);
    } else {
      userNameInput.setCustomValidity('');
    }
  });
}

if (fireballColorElement) {
  fireballColorElement.addEventListener('click', (evt) => {
    const randomColor = getRandomArrayElement(Colors.FIREBALL);
    evt.target.style.backgroundColor = randomColor;
    if (fireballColorInput) {
      fireballColorInput.value = randomColor;
    }
  });
}

if (eyesColorElement) {
  eyesColorElement.addEventListener('click', (evt) => {
    const randomColor = getRandomArrayElement(Colors.EYES);
    evt.target.style.fill = randomColor;
    if (eyesColorInput) {
      eyesColorInput.value = randomColor;
    }
  });
}

if (coatColorElement) {
  coatColorElement.addEventListener('click', (evt) => {
    const randomColor = getRandomArrayElement(Colors.COAT);
    evt.target.style.fill = randomColor;
    if (coatColorInput) {
      coatColorInput.value = randomColor;
    }
  });
}
