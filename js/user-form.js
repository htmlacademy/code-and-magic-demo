import {getRandomArrayElement} from './util.js';

const Color = {
  FIREBALLS: [
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
  COATS: [
    'rgb(101, 137, 164)',
    'rgb(241, 43, 107)',
    'rgb(146, 100, 161)',
    'rgb(56, 159, 117)',
    'rgb(215, 210, 55)',
    'rgb(0, 0, 0)',
  ],
};

const wizardForm = document.querySelector('.setup-wizard-form');
const fireballColorElement = wizardForm.querySelector('.setup-fireball-wrap');
const eyesColorElement = wizardForm.querySelector('.wizard-eyes');
const coatColorElement = wizardForm.querySelector('.wizard-coat');
const fireballColorInput = wizardForm.querySelector('[name="fireball-color"]');
const eyesColorInput = wizardForm.querySelector('[name="eyes-color"]');
const coatColorInput = wizardForm.querySelector('[name="coat-color"]');

fireballColorElement.addEventListener('click', (evt) => {
  const randomColor = getRandomArrayElement(Color.FIREBALLS);
  evt.target.style.backgroundColor = randomColor;
  fireballColorInput.value = randomColor;
});

eyesColorElement.addEventListener('click', (evt) => {
  const randomColor = getRandomArrayElement(Color.EYES);
  evt.target.style.fill = randomColor;
  eyesColorInput.value = randomColor;
});

coatColorElement.addEventListener('click', (evt) => {
  const randomColor = getRandomArrayElement(Color.COATS);
  evt.target.style.fill = randomColor;
  coatColorInput.value = randomColor;
});

const pristine = new Pristine(wizardForm, {
  classTo: 'setup-wizard-form__element',
  errorTextParent: 'setup-wizard-form__element',
  errorTextClass: 'setup-wizard-form__error-text',
});

wizardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid) {
    console.log('Можно отправлять');
  } else {
    console.log('Форма невалидна');
  }
});
