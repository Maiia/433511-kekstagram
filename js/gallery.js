'use strict';

(function () {
  window.usersPhotosArr = [];
  var filterImages = document.querySelector('.filters');

  function renderPicturesBlock(arr) {
    for (var i = 0; i < arr.length; i++) {
      window.picture.renderItem(arr[i]);
    }

    window.preview(window, arr);
  }

  function successHandler(photosObject) {
    window.usersPhotosArr = photosObject;
    renderPicturesBlock(window.usersPhotosArr);

    window.util.showBlock(filterImages);
  }

  window.backend.load(successHandler, window.util.errorHandler);

  window.gallery = (function () {
    function getPhotoByIndex(galleryItem, itemIndex, currentGallery) {

      var item = currentGallery[itemIndex];
      galleryItem.querySelector('.gallery-overlay-image').setAttribute('src', item.url);
      galleryItem.querySelector('.likes-count').textContent = item.likes;
      galleryItem.querySelector('.comments-count').textContent = item.comments.length;
    }

    return {
      getPhotoByIndex: getPhotoByIndex
    };
  })();


  // filters
  filterImages.addEventListener('click', function (evt) {
    var element = evt.target;
    if (element.className === 'filters-item') {
      var elementStyle = element.getAttribute('for').replace('filter-', '');
      emptyInnerHTML(document.querySelector('.pictures'));

      switch (elementStyle) {
        case 'recommend':
          showRecommended();
          break;

        case 'popular':
          showPopular();
          break;

        case 'discussed':
          showDiscussed();
          break;

        case 'random':
          showRandom();
          break;
      }

    }
  });

  function emptyInnerHTML(item) {
    var childNodeItem = item.children;
    for (var i = childNodeItem.length - 1; i >= 0; i--) {
      item.removeChild(childNodeItem[i]);
    }
  }

  function showRecommended() {
    window.util.debounce(renderPicturesBlock(window.usersPhotosArr));
  }

  function showPopular() {
    var popularItemsFilter = window.usersPhotosArr.slice(0).sort(function (photo1, photo2) {

      return photo1.likes - photo2.likes;
    });
    var wrapper = renderPicturesBlock.bind(null, popularItemsFilter.reverse());
    window.util.debounce(wrapper);
  }

  function showDiscussed() {
    var discussedItemsFilter = window.usersPhotosArr.slice(0).sort(function (photo1, photo2) {

      return photo1.comments.length - photo2.comments.length;
    });
    var wrapper = renderPicturesBlock.bind(null, discussedItemsFilter.reverse());
    window.util.debounce(wrapper);
  }

  function showRandom() {
    var randomItemsFilter = window.usersPhotosArr.slice(0).sort(function () {

      return Math.random() - 0.5;
    });

    var wrapper = renderPicturesBlock.bind(null, randomItemsFilter);
    window.util.debounce(wrapper);
  }

})();
