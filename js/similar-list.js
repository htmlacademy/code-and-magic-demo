import {createWizards} from './data.js';

const similarElement = document.querySelector('.setup-similar');
similarElement.classList.remove('hidden');

const similarListElement = similarElement.querySelector('.setup-similar-list');
const similarWizardTemplate = document.querySelector('#similar-wizard-template')
  .content
  .querySelector('.setup-similar-item');

const similarWizards = createWizards();

const renderSimilarList = () => {
  const similarListFragment = document.createDocumentFragment();

  similarWizards.forEach(({name, coatColor, eyesColor}) => {
    const wizardElement = similarWizardTemplate.cloneNode(true);
    wizardElement.querySelector('.setup-similar-label').textContent = name;
    wizardElement.querySelector('.wizard-coat').style.fill = coatColor;
    wizardElement.querySelector('.wizard-eyes').style.fill = eyesColor;
    similarListFragment.appendChild(wizardElement);
  });

  similarListElement.appendChild(similarListFragment);
};

const clearSimilarList = () => {
  similarListElement.innerHTML = '';
};

export {renderSimilarList, clearSimilarList};
