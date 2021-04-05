const similarWizardsElement = document.querySelector('.setup-similar');

const similarWizardsListElement = similarWizardsElement.querySelector('.setup-similar-list');
const similarWizardTemplateElement = document.querySelector('#similar-wizard-template');

const renderSimilarList = (similarWizards) => {
  if (similarWizardsListElement && similarWizardTemplateElement) {
    const similarWizardTemplate = similarWizardTemplateElement
      .content
      .querySelector('.setup-similar-item');

    const similarListFragment = document.createDocumentFragment();

    similarWizards.forEach(({name, colorCoat, colorEyes}) => {
      const wizardElement = similarWizardTemplate.cloneNode(true);
      wizardElement.querySelector('.setup-similar-label').textContent = name;
      wizardElement.querySelector('.wizard-coat').style.fill = colorCoat;
      wizardElement.querySelector('.wizard-eyes').style.fill = colorEyes;
      similarListFragment.appendChild(wizardElement);
    });

    similarWizardsListElement.appendChild(similarListFragment);
    similarWizardsElement.classList.remove('hidden');
  }
};

const clearSimilarList = () => {
  if (similarWizardsListElement) {
    similarWizardsListElement.innerHTML = '';
  }
};

export {renderSimilarList, clearSimilarList};
