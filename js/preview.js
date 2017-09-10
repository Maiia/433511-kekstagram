'use strict';

window.preview = (function (window) {

  var gallery = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = gallery.querySelector('.gallery-overlay-close');
  var pictureItems = document.querySelectorAll('.picture');

  function renderGalleryOverlay(itemIndex) {
    window.util.showBlock(gallery);
    window.gallery.getPhotoByIndex(gallery, itemIndex);
  }

  function openGalleryOverlay(evt) {
    evt.preventDefault();
    var targetPicture = evt.currentTarget;
    var pictureItemsArr = Array.prototype.slice.call(pictureItems, 0);
    var pictureIndex = pictureItemsArr.indexOf(targetPicture);
    renderGalleryOverlay(pictureIndex);

    var galleryOverlayHandlers = [
			['add', galleryOverlayClose, 'click', onCloseClick],
			['add', galleryOverlayClose, 'keydown', onCloseEnterDown],
			['add', document, 'keydown', onEscapeDown]
    ];
    window.util.addRemoveHandlers(galleryOverlayHandlers);
  }

  function closeGalleryOverlay(evt) {
    window.util.hideBlock(gallery);

    galleryOverlayClose.removeEventListener('click', onCloseClick);
    document.removeEventListener('keydown', onEscapeDown);
  }

	// ~general
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

	// HANDLERS
  function onPictureClick(evt) {
    openGalleryOverlay(evt);
  }

  function onCloseClick(evt) {
    closeGalleryOverlay(evt);
  }
  function onCloseEnterDown(evt) {
    if (evt.keyCode === window.ENTER_KEYCODE) {
      closeGalleryOverlay(evt);
    }
  }
  function onEscapeDown(evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      if (!(gallery.classList.contains('hidden'))) {
        closeGalleryOverlay(evt);
      }
    }
  }
  addCollectionElHandlers(pictureItems, {'click': onPictureClick});

});
