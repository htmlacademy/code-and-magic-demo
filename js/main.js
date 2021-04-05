import './setup.js';
import {closeWizardSetup} from './wizard-setup-modal.js';
import {setWizardSetupFormSubmit} from './wizard-setup-form.js';
import {renderSimilarList} from './similar-wizards-list.js';
import {getData, sendData} from './api.js';

const SIMILAR_WIZARD_COUNT = 4;

getData((wizards) => {
  renderSimilarList(wizards.slice(0, SIMILAR_WIZARD_COUNT));
});

setWizardSetupFormSubmit(sendData, closeWizardSetup);
