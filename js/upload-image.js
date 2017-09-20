'use strict';

window.uploadImage = (function () {
  function addImage() {
    var selectedImg = document.querySelector('.effect-image-preview');
    var file = document.querySelector('input#upload-file[type=file]').files[0];
    var reader = new FileReader();
    var previewImage = document.querySelectorAll('.upload-effect-preview'); // TODO есть исп-е в др.месте

    reader.onloadend = function () {
      selectedImg.src = reader.result;
      previewImage.forEach(function (item) {
        item.style = 'background-image: url(' + reader.result + ')';
      });
    };

    var imgFormat = file.name.toLowerCase().split('.').slice(-1);

    if (imgFormat[0] === 'png' || imgFormat[0] === 'gif' || imgFormat[0] === 'jpeg' || imgFormat[0] === 'jpg') {
      reader.readAsDataURL(file);
    }
  }

  return {
    addImage: addImage
  };

})();
