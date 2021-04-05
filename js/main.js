import './setup.js';
import {closeUserModal} from './user-modal.js';
import {setUserFormSubmit} from './user-form.js';
import {renderSimilarList} from './similar-list.js';
import {getData} from './api.js';

const SIMILAR_WIZARD_COUNT = 4;

getData((wizards) => {
  renderSimilarList(wizards.slice(0, SIMILAR_WIZARD_COUNT));
});

setUserFormSubmit(closeUserModal);
