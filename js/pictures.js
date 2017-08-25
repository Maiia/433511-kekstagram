'use strict';

var IMAGES_AMOUNT = 26;
var PHOTOS_COMMENTS = [
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

// part #1 - CREATING OF PHOTOS OBJECT
function getRandomIndex(max, min) {
  return Math.round(Math.random() * (max - min)) + min;
}

function createPhotosUrl() {
  var PHOTOS_URL = [];

  for (var i = 1; i <= IMAGES_AMOUNT; i++) {
    PHOTOS_URL.push('photos/' + i + '.jpg');
  }
  return PHOTOS_URL;
}

function setUsersComments(amount) {
  var comments = [];
  for (var i = 0; i < amount; i++) {
    comments.push(PHOTOS_COMMENTS[getRandomIndex(0, PHOTOS_COMMENTS.length - 1)]);
  }
  return comments;
}

function createPhotosObject() {
  var PHOTOS_URL = createPhotosUrl();

  for (var i = 0; i < PHOTOS_URL.length; i++) {
    usersPhotosArr.push({
      url: PHOTOS_URL[i],
      likes: getRandomIndex(200, 15),
      comments: setUsersComments(getRandomIndex(1, 2))
    });
  }
  return usersPhotosArr;
}
createPhotosObject();


// part #2 - CREATING OF GALLERY
function renderPicturesBlock() {
  for (var i = 0; i < usersPhotosArr.length; i++) {
    renderPictureItem(usersPhotosArr[i]);
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

renderPicturesBlock();


// part #3 - GALLERY OVERLAY BLOCK
var gallery = document.querySelector('.gallery-overlay');
var pictureItems = document.querySelectorAll('.picture');
var galleryOverlayClose = gallery.querySelector('.gallery-overlay-close');

function renderGalleryOverlay(itemIndex) {
  var item = usersPhotosArr[itemIndex];
  gallery.classList.remove('hidden');
  gallery.querySelector('.gallery-overlay-image').setAttribute('src', item.url);
  gallery.querySelector('.likes-count').textContent = item.likes;
  gallery.querySelector('.comments-count').textContent = item.comments.length;
}


// part #3.1 - GALLERY OVERLAY PICTURES HANDLERS
function addEventListenersToPictures() {
  pictureItems.forEach(function (item) {
    item.addEventListener('click', onPictureClick);
    item.addEventListener('keydown', onPictureEnterDown);
  });
}

function onPictureClick(evt) {
  openGalleryOverlay(evt);
}
function onPictureEnterDown(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openGalleryOverlay(evt);
  }
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
    closeGalleryOverlay(evt);
  }
}

// part #3.2 - GALLERY OVERLAY HANDLERS FUNCTIONS
function openGalleryOverlay(evt) {
  evt.preventDefault();
  var targetPicture = evt.currentTarget;
  var pictureItemsArr = Array.prototype.slice.call(pictureItems, 0);
  var pictureIndex = pictureItemsArr.indexOf(targetPicture);
  renderGalleryOverlay(pictureIndex);

  galleryOverlayClose.addEventListener('click', onCloseClick);
  galleryOverlayClose.addEventListener('keydown', onCloseEnterDown);
  document.addEventListener('keydown', onEscapeDown);
}

function closeGalleryOverlay(evt) {
  gallery.classList.add('hidden');

  galleryOverlayClose.removeEventListener('click', onCloseClick);
  galleryOverlayClose.removeEventListener('keydown', onCloseEnterDown);
  document.removeEventListener('keydown', onEscapeDown);
}

addEventListenersToPictures();


// part #4.1 - UPLOAD OVERLAY
document.querySelector('.upload-overlay').classList.add('hidden');


