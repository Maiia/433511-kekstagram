'use strict';

window.initializeFilters = (function () {
  function addEffectFilter(filterItem, applyFunction, resetLevelFunc) {
    filterItem.addEventListener('click', function (evt) {
      var element = evt.target;
      if (element.className === 'upload-effect-preview') {
        var elementStyle = element.parentNode.getAttribute('for').replace('upload-', '');
        window.currentFilter = elementStyle.replace('effect-', '');
        window.level.classList.remove('hidden');
        window.changeLevel(window.levelDefault);
        resetLevelFunc();
        applyFunction(elementStyle);
      }

    });
  }

  return {
    addEffectFilter: addEffectFilter
  };

})();
