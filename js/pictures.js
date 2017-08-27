'use strict';

var IMAGES_AMOUNT = 26;
var photosComments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var usersPhotosArr = [];

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var pictureItems = [];

var gallery = document.querySelector('.gallery-overlay');
var galleryOverlayClose = gallery.querySelector('.gallery-overlay-close');

var uploadOverlay = document.querySelector('.upload-overlay');
var uploadInput = document.querySelector('#upload-file');
var buttonCancelUploadOverlay = uploadOverlay.querySelector('.upload-form-cancel');
var controlsUploadOverlay = uploadOverlay.querySelector('.upload-effect-controls');

var uploadResizeControls = uploadOverlay.querySelector('.upload-resize-controls');

var buttonDecControl = uploadResizeControls.querySelector('.upload-resize-controls-button-dec');
var buttonIncControl = uploadResizeControls.querySelector('.upload-resize-controls-button-inc');
var commentField = document.querySelector('#upload-select-image');
var hashTagsUploadOverlay = uploadOverlay.querySelector('.upload-form-hashtags');
var commentsUploadOverlay = uploadOverlay.querySelector('.upload-form-description');


// part #1 - CREATING OF PHOTOS OBJECT
function getRandomIndex(max, min) {
  return Math.round(Math.random() * (max - min)) + min;
}

function createPhotosUrl() {
  var photosUrl = [];

  for (var i = 1; i <= IMAGES_AMOUNT; i++) {
    photosUrl.push('photos/' + i + '.jpg');
  }
  return photosUrl;
}

function setUsersComments(amount) {
  var comments = [];
  for (var i = 0; i < amount; i++) {
    comments.push(photosComments[getRandomIndex(0, photosComments.length - 1)]);
  }
  return comments;
}

function createPhotosObject(arr) {
  var photosUrl = createPhotosUrl();
  for (var i = 0; i < photosUrl.length; i++) {
    arr.push({
      url: photosUrl[i],
      likes: getRandomIndex(200, 15),
      comments: setUsersComments(getRandomIndex(1, 2))
    });
  }
  return usersPhotosArr;
}


// part #2 - CREATING OF GALLERY
function renderPicturesBlock(arr) {
  for (var i = 0; i < arr.length; i++) {
    renderPictureItem(arr[i]);
  }
}

function renderPictureItem(item) {
  var pictureTemplate = document.querySelector('#picture-template').content;
  var pictureItem = pictureTemplate.cloneNode(true);
  var fragment = document.createDocumentFragment();

  pictureItem.querySelector('img').setAttribute('src', item.url);
  pictureItem.querySelector('.picture-likes').textContent = item.likes;
  pictureItem.querySelector('.picture-comments').textContent = item.comments.length;
  fragment.appendChild(pictureItem);

  document.querySelector('.pictures').appendChild(fragment);
}


// part #3 - GALLERY OVERLAY BLOCK
function renderGalleryOverlay(itemIndex) {
  var item = usersPhotosArr[itemIndex];
  gallery.classList.remove('hidden');
  gallery.querySelector('.gallery-overlay-image').setAttribute('src', item.url);
  gallery.querySelector('.likes-count').textContent = item.likes;
  gallery.querySelector('.comments-count').textContent = item.comments.length;
}

// part #3.1 - GALLERY OVERLAY PICTURES HANDLERS
function onPictureClick(evt) {
  openGalleryOverlay(evt);
}

function onCloseClick(evt) {
  closeGalleryOverlay(evt);
}
function onCloseEnterDown(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeGalleryOverlay(evt);
  }
}
function onEscapeDown(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    if (!(gallery.classList.contains('hidden'))) {
      closeGalleryOverlay(evt);
    } else if (!(uploadOverlay.classList.contains('hidden'))) {
      if (!(commentsUploadOverlay === document.activeElement)) {
        closeUploadOverlay(evt);
      }
    }
  }
}

// part #3.2 - GALLERY OVERLAY HANDLERS FUNCTIONS
function openGalleryOverlay(evt) {
  evt.preventDefault();
  var targetPicture = evt.currentTarget;
  var pictureItemsArr = Array.prototype.slice.call(pictureItems, 0);
  var pictureIndex = pictureItemsArr.indexOf(targetPicture);
  renderGalleryOverlay(pictureIndex);

  var galleryOverlayHendlers = [
    ['add', galleryOverlayClose, 'click', onCloseClick],
    ['add', galleryOverlayClose, 'keydown', onCloseEnterDown],
    ['add', document, 'keydown', onEscapeDown]
  ];
  addRemoveHandlers(galleryOverlayHendlers);
}

function closeGalleryOverlay(evt) {
  gallery.classList.add('hidden');

  galleryOverlayClose.removeEventListener('click', onCloseClick);
  document.removeEventListener('keydown', onEscapeDown);
}


// part #4.1 - UPLOAD OVERLAY

// HANDLERS
function onUploadInputClick() {
  openUploadOverlay();
}
function onCancelUploadOverlayClick() {
  closeUploadOverlay();
  uploadInput.click();
}


// UPLOAD OVERLAY HANDLERS FUNCTIONS
function openUploadOverlay() {
  addRemoveHandlers([
    ['add', buttonCancelUploadOverlay, 'click', onCancelUploadOverlayClick],
    ['add', document, 'keydown', onEscapeDown],
    ['add', buttonIncControl, 'click', onButtonResizeClick],
    ['add', buttonDecControl, 'click', onButtonResizeClick],
    ['add', commentField, 'change', onCommentChange],
    ['add', commentField, 'invalid', onCommentInvalid, true],
    ['add', hashTagsUploadOverlay, 'input', onHashtagsInput],
    ['add', commentsUploadOverlay, 'input', onCommentsInput],
    ['add', controlsUploadOverlay, 'click', itemEffectControlClick]
  ]);

  uploadOverlay.classList.remove('hidden');
}

function closeUploadOverlay() {
  addRemoveHandlers([
    ['remove', buttonCancelUploadOverlay, 'click', onCancelUploadOverlayClick],
    ['remove', document, 'keydown', onEscapeDown],
    ['remove', buttonIncControl, 'click', onButtonResizeClick],
    ['remove', buttonDecControl, 'click', onButtonResizeClick],
    ['remove', commentField, 'change', onCommentChange],
    ['remove', commentField, 'invalid', onCommentInvalid, true],
    ['remove', hashTagsUploadOverlay, 'input', onHashtagsInput],
    ['remove', commentsUploadOverlay, 'input', onCommentsInput],
    ['remove', controlsUploadOverlay, 'click', itemEffectControlClick]
  ]);

  uploadOverlay.classList.add('hidden');
}

function itemEffectControlClick(evt) {
  var element = evt.target;
  if (element.className === 'upload-effect-preview') {
    var elementStyle = element.parentNode.getAttribute('for').replace('upload-', '');
    addClassByControlClick(elementStyle);
  }
}

function addClassByControlClick(elementStyle) {
  var imagePreviewUploadOverlay = uploadOverlay.querySelector('.effect-image-preview');
  imagePreviewUploadOverlay.classList = '';
  imagePreviewUploadOverlay.classList.add('effect-image-preview');
  imagePreviewUploadOverlay.classList.add(elementStyle);
}


// SCALE OF UPLOAD OVERLAY PREVIEV IMAGE
function onButtonResizeClick(evt) {
  var effectImagePreviewUploadResize = document.querySelector('.effect-image-preview');
  var element = evt.currentTarget;
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
  changeElemScale(effectImagePreviewUploadResize, controlValue);
}

function changeElemScale(element, scale) {
  var scaleValue = scale / 100;
  element.style.cssText = 'transform: scale(' + scaleValue + ')';
}

// UPLOAD OVERLAY FORM FIELDS VALIDATION
function onCommentChange(evt) {
  var targetEl = evt.target;
  targetEl.style.borderColor = '';
}
function onCommentInvalid(evt) {
  var targetEl = evt.target;
  targetEl.style.borderColor = 'red';
}

function onHashtagsInput(evt) {
  var targetEl = evt.target;
  var valueArr = targetEl.value.split(' ');

  // flags
  var noHashtag = false;
  var isRepeated = false;
  var isTooLong = false;
  var tooMuchItems = false;

  var testArr = [];
  for (var i = 0; i < valueArr.length; i++) {
    noHashtag = valueArr[i].charAt(0) !== '#';
    isTooLong = valueArr[i].length > 20;

    if (testArr.indexOf(valueArr[i]) === -1) {
      testArr.push(valueArr[i]);
    } else {
      isRepeated = true;
    }
  }
  tooMuchItems = valueArr.length > 5;

  hashtagsSetValidity(evt, noHashtag, isRepeated, isTooLong, tooMuchItems);
}
function hashtagsSetValidity(evt, noHashtag, isRepeated, isTooLong, tooMuchItems) {
  var targetEl = evt.target;

  if (noHashtag) {
    targetEl.setCustomValidity('hashtags should start with \'#\' and splitted by \' \'');
  } else if (isRepeated) {
    targetEl.setCustomValidity('hashtags should not be repeated');
  } else if (tooMuchItems) {
    targetEl.setCustomValidity('amount of hashtags should not be more than 5');
  } else if (isTooLong) {
    targetEl.setCustomValidity('hashtags should not be more than 20 chars');
  } else {
    targetEl.setCustomValidity('');
  }
}

function onCommentsInput(evt) {
  var targetEl = evt.target;
  if (targetEl.validity.tooShort) {
    targetEl.setCustomValidity('Comment is too short');
  } else if (targetEl.validity.tooLong) {
    targetEl.setCustomValidity('Comment is too long');
  } else {
    targetEl.setCustomValidity('');
  }
}

// general
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


function init() {
  usersPhotosArr = createPhotosObject(usersPhotosArr);
  renderPicturesBlock(usersPhotosArr);
  pictureItems = document.querySelectorAll('.picture');
  addCollectionElHandlers(pictureItems, {'click': onPictureClick});
  uploadInput.addEventListener('change', onUploadInputClick);
}
init();
