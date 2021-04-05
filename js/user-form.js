import {showAlert, getRandomArrayElement} from './util.js';
import {sendData} from './api.js';

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

const SubmitButtonText = {
  IDLE: 'Сохранить',
  SENDING: 'Сохраняю...'
};

const wizardForm = document.querySelector('.setup-wizard-form');
const fireballColorElement = wizardForm.querySelector('.setup-fireball-wrap');
const eyesColorElement = wizardForm.querySelector('.wizard-eyes');
const coatColorElement = wizardForm.querySelector('.wizard-coat');
const fireballColorInput = wizardForm.querySelector('[name="fireball-color"]');
const eyesColorInput = wizardForm.querySelector('[name="eyes-color"]');
const coatColorInput = wizardForm.querySelector('[name="coat-color"]');
const submitButton = wizardForm.querySelector('.setup-submit');

fireballColorElement.addEventListener('click', (evt) => {
  const randomColor = getRandomArrayElement(Color.FIREBALLS);
  evt.target.style.backgroundColor = randomColor;
  fireballColorInput.value = randomColor;
});

const setEyesClick = (cb) => {
  eyesColorElement.addEventListener('click', (evt) => {
    const randomColor = getRandomArrayElement(Color.EYES);
    evt.target.style.fill = randomColor;
    eyesColorInput.value = randomColor;
    cb();
  });
};

const setCoatClick = (cb) => {
  coatColorElement.addEventListener('click', (evt) => {
    const randomColor = getRandomArrayElement(Color.COATS);
    evt.target.style.fill = randomColor;
    coatColorInput.value = randomColor;
    cb();
  });
};

const pristine = new Pristine(wizardForm, {
  classTo: 'setup-wizard-form__element',
  errorTextParent: 'setup-wizard-form__element',
  errorTextClass: 'setup-wizard-form__error-text',
});

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SubmitButtonText.IDLE;
};

const setUserFormSubmit = (onSuccess) => {
  wizardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(new FormData(evt.target))
        .then(onSuccess)
        .catch(
          (err) => {
            showAlert(err.message);
          }
        )
        .finally(unblockSubmitButton);
    }
  });
};

export {setUserFormSubmit, setEyesClick, setCoatClick};
