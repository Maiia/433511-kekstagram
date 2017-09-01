'use strict';

(function () {
  var usersPhotosArr = [];

  function renderPicturesBlock(arr) {
    for (var i = 0; i < arr.length; i++) {
      window.picture.renderPictureItem(arr[i]);
    }
  }

  function init() {
    usersPhotosArr = window.data.getPhotosData();
    renderPicturesBlock(usersPhotosArr);
  }
  init();

  window.gallery = (function () {
    function getPhotoByIndex(galleryItem, itemIndex) {
      var item = usersPhotosArr[itemIndex];
      galleryItem.querySelector('.gallery-overlay-image').setAttribute('src', item.url);
      galleryItem.querySelector('.likes-count').textContent = item.likes;
      galleryItem.querySelector('.comments-count').textContent = item.comments.length;
    }
    return {
      getPhotoByIndex: getPhotoByIndex
    };
  })();

})();
