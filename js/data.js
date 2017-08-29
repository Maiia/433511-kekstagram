'use strict';

(function () {

  window.usersPhotosArr = [];

  var IMAGES_AMOUNT = 26;
  var photosComments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

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
    return window.usersPhotosArr;
  }

  window.usersPhotosArr = createPhotosObject(window.usersPhotosArr);

})();
