'use strict';

(function () {

  function renderPicturesBlock(arr) {
    for (var i = 0; i < arr.length; i++) {
      window.picture.renderPictureItem(arr[i]);
    }
  }

  renderPicturesBlock(window.usersPhotosArr);

})();
