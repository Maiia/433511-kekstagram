'use strict';

(function () {
  var usersPhotosArr = [];
  var filterImages = document.querySelector('.filters');
  var lastTimeout;

  function renderPicturesBlock(arr) {
    for (var i = 0; i < arr.length; i++) {
      window.picture.renderPictureItem(arr[i]);
    }
  }

  function successHandler(photosObject) {
    usersPhotosArr = photosObject;
    renderPicturesBlock(usersPhotosArr);
    window.preview(window);

    window.util.showBlock(filterImages);
  }

  window.backend.load(successHandler, window.util.errorHandler);

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

  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, 300);
  };

  function showRecommended() {
    debounce(renderPicturesBlock(usersPhotosArr));
  }
  function showPopular() {
    var popularItemsFilter = usersPhotosArr.slice(0).sort(function (photo1, photo2) {
      return photo1.likes - photo2.likes;
    });
    var wrapper = renderPicturesBlock.bind(null, popularItemsFilter.reverse());
    debounce(wrapper);
  }
  function showDiscussed() {
    var discussedItemsFilter = usersPhotosArr.slice(0).sort(function (photo1, photo2) {
      return photo1.comments.length - photo2.comments.length;
    });
    var wrapper = renderPicturesBlock.bind(null, discussedItemsFilter.reverse());
    debounce(wrapper);
  }
  function showRandom() {
    var randomItemsFilter = usersPhotosArr.slice(0).sort(function (photo1, photo2) {
      return Math.random() - 0.5;
    });
    var wrapper = renderPicturesBlock.bind(null, randomItemsFilter);
    debounce(wrapper);
  }

})();
