import './setup.js';
import {closeWizardSetup} from './wizard-setup-modal.js';
import {setWizardSetupFormSubmit, setEyesClick, setCoatClick} from './wizard-setup-form.js';
import {renderSimilarList} from './similar-wizards-list.js';
import {getData, sendData} from './api.js';

getData((wizards) => {
  renderSimilarList(wizards);
  setEyesClick(() => renderSimilarList(wizards));
  setCoatClick(() => renderSimilarList(wizards));
});

setWizardSetupFormSubmit(sendData, closeWizardSetup);
