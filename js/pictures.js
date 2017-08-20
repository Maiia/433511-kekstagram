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

// part #2 - creating of DOM-elements
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

  document.querySelector('.upload-overlay').classList.add('hidden');
}

function renderGalleryOverlay() {
  var item = usersPhotosArr[0];

  var gallery = document.querySelector('.gallery-overlay');
  gallery.classList.remove('hidden');

  gallery.querySelector('.gallery-overlay-image').setAttribute('src', item.url);
  gallery.querySelector('.likes-count').textContent = item.likes;
  gallery.querySelector('.comments-count').textContent = item.comments.length;
}

renderPicturesBlock();

renderGalleryOverlay();
