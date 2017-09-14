'use strict';

window.util = (function (window) {

  window.ESC_KEYCODE = 27;
  window.ENTER_KEYCODE = 13;
  var DEBOUNCE_TIME = 300;
  var lastTimeout;

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

  function showBlock(item) {
    if (item.classList.contains('hidden')) {
      item.classList.remove('hidden');
    }
  }

  function hideBlock(item) {
    if (!(item.classList.contains('hidden'))) {
      item.classList.add('hidden');
    }
  }

  function debounce(func) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(func, DEBOUNCE_TIME);
  }

  function addCollectionElHandlers(collection, obj) {
    var eventHandlers = obj;
    collection.forEach(function (item) {
      for (var key in eventHandlers) {
        if (eventHandlers.hasOwnProperty(key)) {
          item.addEventListener(key, eventHandlers[key]);
        }
      }
    });
  }

  function errorHandler(errorMessage) {
    var item = document.createElement('div');
    item.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    item.style.position = 'absolute';
    item.style.left = '50%';
    item.style.top = '50%';
    item.style.transform = 'translate(-50%, -50%)';
    item.style.padding = '50px';
    item.style.fontSize = '40px';
    item.style.color = 'white';
    item.style.background = 'rgba(255, 0, 0, .7)';
    item.style.minWidth = '50%';

    item.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', item);
  }

  return {
    addRemoveHandlers: addRemoveHandlers,
    errorHandler: errorHandler,
    showBlock: showBlock,
    hideBlock: hideBlock,
    debounce: debounce,
    addCollectionElHandlers: addCollectionElHandlers
  };

})(window);
