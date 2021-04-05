import './setup.js';
import {closeUserModal} from './user-modal.js';
import {setUserFormSubmit, setEyesClick, setCoatClick} from './user-form.js';
import {renderSimilarList} from './similar-list.js';
import {getData} from './api.js';
import {showAlert} from './util.js';


getData()
  .then((wizards) => {
    renderSimilarList(wizards);
    setEyesClick(() => renderSimilarList(wizards));
    setCoatClick(() => renderSimilarList(wizards));
  })
  .catch(
    (err) => {
      showAlert(err.message);
    }
  );

setUserFormSubmit(closeUserModal);
