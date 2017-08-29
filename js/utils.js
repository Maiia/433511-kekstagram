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
  return {
    addRemoveHandlers: addRemoveHandlers
  };
})(window);
