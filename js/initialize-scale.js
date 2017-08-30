'use strict';

window.initializeScale = function (controlsResize, functionScale) {
  controlsResize.addEventListener('click', function (evt) {
    var element = evt.target;
    var elementModyfiing = element.parentNode.querySelector('input');
    var controlValue = parseInt(elementModyfiing.getAttribute('value'), 10);

    var controlValueStep = parseInt(elementModyfiing.getAttribute('step'), 10);
    var controlValueMax = parseInt(elementModyfiing.getAttribute('maxlength'), 10);
    var controlValueMin = parseInt(elementModyfiing.getAttribute('minlength'), 10);
    var elTextContent = element.textContent[0];
    if (elTextContent === '+' && controlValue + controlValueStep <= controlValueMax) {
      controlValue += controlValueStep;
    } else if (elTextContent === '–' && controlValue - controlValueStep >= controlValueMin) {
      controlValue -= controlValueStep;
    }
    elementModyfiing.setAttribute('value', controlValue + '%');
    functionScale(controlValue);
  });
};
