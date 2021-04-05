import './setup.js';
import {closeUserModal} from './user-modal.js';
import {setUserFormSubmit, setEyesClick, setCoatClick} from './user-form.js';
import {renderSimilarList} from './similar-list.js';
import {getData} from './api.js';
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

setUserFormSubmit(closeUserModal);
