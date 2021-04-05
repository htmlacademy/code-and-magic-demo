import './setup.js';
import {closeUserModal} from './user-modal.js';
import {setUserFormSubmit, setEyesClick, setCoatClick} from './user-form.js';
import {renderSimilarList} from './similar-list.js';
import {getData} from './api.js';

getData((wizards) => {
  renderSimilarList(wizards);
  setEyesClick(() => renderSimilarList(wizards));
  setCoatClick(() => renderSimilarList(wizards));
});

setUserFormSubmit(closeUserModal);
