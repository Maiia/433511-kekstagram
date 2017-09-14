'use strict';

window.preview = (function (window, arr) {
  var gallery = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = gallery.querySelector('.gallery-overlay-close');
  var pictureItems = document.querySelectorAll('.picture');

  function renderGalleryOverlay(itemIndex) {
    window.util.showBlock(gallery);
    window.gallery.getPhotoByIndex(gallery, itemIndex, arr);
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

  function closeGalleryOverlay() {
    window.util.hideBlock(gallery);

    var galleryOverlayHandlers = [
      ['remove', galleryOverlayClose, 'click', onCloseClick],
      ['remove', document, 'keydown', onEscapeDown]
    ];

    window.util.addRemoveHandlers(galleryOverlayHandlers);
  }

	// HANDLERS
  function onCloseClick(evt) {
    closeGalleryOverlay(evt);
  }

  function onPictureClick(evt) {
    openGalleryOverlay(evt);
  }

  function onCloseEnterDown(evt) {
    if (evt.keyCode === window.ENTER_KEYCODE) {
      closeGalleryOverlay(evt);
    }
  }

  function onEscapeDown(evt) {
    if (evt.keyCode === window.ESC_KEYCODE && !(gallery.classList.contains('hidden'))) {
      closeGalleryOverlay(evt);
    }
  }

  window.util.addCollectionElHandlers(pictureItems, {'click': onPictureClick});

});
