import {isEscEvent, isEnterEvent} from './util.js';

const wizardSetupElement = document.querySelector('.setup');
const wizardSetupOpenElement = document.querySelector('.setup-open');
const wizardSetupCloseElement = wizardSetupElement.querySelector('.setup-close');

const onWizardSetupEscKeydown = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    closeWizardSetup();
  }
};

const onWizardSetupCloseClick = () => {
  closeWizardSetup();
};

const onWizardSetupCloseEnterKeydown = (evt) => {
  if (isEnterEvent(evt)) {
    evt.preventDefault();
    closeWizardSetup();
  }
};

function openWizardSetup () {
  if (wizardSetupElement) {
    wizardSetupElement.classList.remove('hidden');

    document.addEventListener('keydown', onWizardSetupEscKeydown);

    if (wizardSetupCloseElement) {
      wizardSetupCloseElement.addEventListener('click', onWizardSetupCloseClick);
      wizardSetupCloseElement.addEventListener('keydown', onWizardSetupCloseEnterKeydown);
    }
  }
}

function closeWizardSetup () {
  if (wizardSetupElement) {
    wizardSetupElement.classList.add('hidden');

    document.removeEventListener('keydown', onWizardSetupEscKeydown);

    if (wizardSetupCloseElement) {
      wizardSetupCloseElement.removeEventListener('click', onWizardSetupCloseClick);
      wizardSetupCloseElement.removeEventListener('keydown', onWizardSetupCloseEnterKeydown);
    }
  }
}

if (wizardSetupOpenElement) {
  wizardSetupOpenElement.addEventListener('click', () => {
    openWizardSetup();
  });

  wizardSetupOpenElement.addEventListener('keydown', (evt) => {
    if (isEnterEvent(evt)) {
      openWizardSetup();
    }
  });
}

export {closeWizardSetup};
