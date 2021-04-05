import './setup.js';
import {closeWizardSetup} from './wizard-setup-modal.js';
import {setWizardSetupFormSubmit, setEyesClick, setCoatClick} from './wizard-setup-form.js';
import {renderSimilarList} from './similar-wizards-list.js';
import {getData, sendData} from './api.js';
import {debounce} from './util.js';

const RERENDER_DELAY = 500;

getData((wizards) => {
  renderSimilarList(wizards);
  setEyesClick(debounce(
    () => renderSimilarList(wizards),
    RERENDER_DELAY,
  ));
  setCoatClick(debounce(
    () => renderSimilarList(wizards),
    RERENDER_DELAY,
  ));
});

setWizardSetupFormSubmit(sendData, closeWizardSetup);
