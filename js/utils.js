'use strict';

window.util = (function (window) {

  window.ESC_KEYCODE = 27;
  window.ENTER_KEYCODE = 13;

  function addRemoveHandlers(arr) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.length === 4) {
        item.push(false);
      } else {
        item.push(true);
      }
      if (item[0] === 'add') {
        item[1].addEventListener(item[2], item[3], item[4]);
      } else {
        item[1].removeEventListener(item[2], item[3], item[4]);
      }
    }
  }

  function errorHandler(errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = '50%';
    node.style.top = '50%';
    node.style.transform = 'translate(-50%, -50%)';
    node.style.padding = '50px';
    node.style.fontSize = '40px';
    node.style.color = 'white';
    node.style.background = 'rgba(255, 0, 0, .7)';
    node.style.minWidth = '50%';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  }
  return {
    addRemoveHandlers: addRemoveHandlers,
    errorHandler: errorHandler
  };
})(window);
