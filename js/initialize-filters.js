'use strict';

window.initializeFilters = (function () {
  function addEffectFilter(filterItem, applyFunction, resetLevelFunc) {
    filterItem.addEventListener('click', function (evt) {
      var element = evt.target;
      if (element.className === 'upload-effect-preview') {
        var elementStyle = element.parentNode.getAttribute('for').replace('upload-', '');
        applyFunction(elementStyle);

        window.currentFilter = elementStyle.replace('effect-', '');

        if (elementStyle !== 'effect-none') {
          window.level.classList.remove('hidden');

          resetLevelFunc();

        } else {
          window.level.classList.add('hidden');
        }
        window.changeLevel(window.levelDefault);
      }
    });
  }

  return {
    addEffectFilter: addEffectFilter
  };

})();
