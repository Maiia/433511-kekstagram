'use strict';

window.picture = (function () {
  function renderItem(item) {
    var pictureTemplate = document.querySelector('#picture-template').content;
    var pictureItem = pictureTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    pictureItem.querySelector('img').setAttribute('src', item.url);
    pictureItem.querySelector('.picture-likes').textContent = item.likes;
    pictureItem.querySelector('.picture-comments').textContent = item.comments.length;
    fragment.appendChild(pictureItem);

    document.querySelector('.pictures').appendChild(fragment);
  }

  return {
    renderItem: renderItem
  };

})();
