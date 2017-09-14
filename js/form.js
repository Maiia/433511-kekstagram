'use strict';

(function () {

  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadInput = document.querySelector('#upload-file');
  var buttonCancel = uploadOverlay.querySelector('.upload-form-cancel');
  var effectControls = uploadOverlay.querySelector('.upload-effect-controls');

  window.level = uploadOverlay.querySelector('.upload-effect-level');
  var levelPin = window.level.querySelector('.upload-effect-level-pin');
  var levelLine = window.level.querySelector('.upload-effect-level-val');
  window.levelDefault = 20;
  var levelMaxWidth = 455;

  var imagePreview = document.querySelector('.effect-image-preview');

  var resizeControls = uploadOverlay.querySelector('.upload-resize-controls');

  var imageEffectBlock = document.querySelector('#upload-select-image');
  var hashTags = uploadOverlay.querySelector('.upload-form-hashtags');
  var commentsField = uploadOverlay.querySelector('.upload-form-description');

  var form = document.querySelector('#upload-select-image');

  window.currentFilter = null;
  var BORDER_INVALID = 'red';

  form.addEventListener('submit', function (evt) {
    var element = evt.currentTarget;
    window.backend.save(new FormData(form), function () {
      closeUploadOverlay();
      element.reset();
    }, window.util.errorHandler);
    evt.preventDefault();
  });

  function openUploadOverlay() {
    window.util.addRemoveHandlers([
      ['add', buttonCancel, 'click', onCancelClick],
      ['add', document, 'keydown', onEscapeDown],
      ['add', imageEffectBlock, 'change', onInputChange],
      ['add', imageEffectBlock, 'invalid', onInputInvalid, true],
      ['add', hashTags, 'input', onHashtagsInput],
      ['add', commentsField, 'input', onCommentsInput]
    ]);
    uploadOverlay.classList.remove('hidden');

    window.level.classList.add('hidden');
  }

  function closeUploadOverlay() {
    window.changeLevel(window.levelDefault);
    resetLevel();
    applyFilter('effect-none');
    imagePreview.style = '';

    window.util.addRemoveHandlers([
      ['remove', buttonCancel, 'click', onCancelClick],
      ['remove', document, 'keydown', onEscapeDown],
      ['remove', imageEffectBlock, 'change', onInputChange],
      ['remove', imageEffectBlock, 'invalid', onInputInvalid, true],
      ['remove', hashTags, 'input', onHashtagsInput],
      ['remove', commentsField, 'input', onCommentsInput]
    ]);

    uploadOverlay.classList.add('hidden');
  }

  function changeElemScale(scaleValue) {
    imagePreview.style.transform = 'scale(' + scaleValue / 100 + ')';
  }

  window.initializeScale(resizeControls, changeElemScale);

  function onLevelPinMove(start) {
    resetScale(resizeControls);

    var startCoords = {
      x: start
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };
      startCoords = {
        x: moveEvt.clientX
      };

      var levelPercent = (levelPin.offsetLeft - shift.x) * 100 / levelMaxWidth;

      if (levelPercent <= 0) {
        levelPercent = 0;
        document.removeEventListener('mousemove', onMouseMove);
      } else if (levelPercent >= 100) {
        levelPercent = 100;
        document.removeEventListener('mousemove', onMouseMove);
      }

      levelPin.style.left = levelPercent + '%';
      levelLine.style.width = levelPercent + '%';

      window.changeLevel(levelPercent);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  levelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    onLevelPinMove(evt.clientX);
  });

  window.changeLevel = function (percent) {
    var effectCoeff = {
      chrome: 'grayscale(' + 0.01 * percent + ')',
      sepia: 'sepia(' + 0.01 * percent + ')',
      marvin: 'invert(' + percent + '%)',
      phobos: 'blur(' + 0.05 * percent + 'px)',
      heat: 'brightness(' + 0.03 * percent + ')'
    };
    imagePreview.style = 'filter:' + effectCoeff[window.currentFilter];
  };

  function resetScale(element) {
    element.querySelector('input').setAttribute('value', '100%');
    changeElemScale(100);
  }

  function resetLevel() {
    levelPin.style.left = window.levelDefault + '%';
    levelLine.style.width = window.levelDefault + '%';
  }

  window.initializeFilters.addEffectFilter(effectControls, applyFilter, resetLevel);

  function applyFilter(elementStyle) {
    imagePreview.classList = '';
    imagePreview.classList.add('effect-image-preview');
    imagePreview.classList.add(elementStyle);

    if (elementStyle === 'effect-none') {
      window.level.classList.add('hidden');
    }
    resetScale(resizeControls);
  }


  // UPLOAD OVERLAY FORM FIELDS VALIDATION
  function onInputChange(evt) {
    var targetEl = evt.target;
    targetEl.style.borderColor = '';
  }

  function onInputInvalid(evt) {
    var targetEl = evt.target;
    targetEl.style.borderColor = BORDER_INVALID;
  }

  function onHashtagsInput(evt) {
    var targetEl = evt.target;
    var valueArr = targetEl.value.split(' ');

    // flags
    var noHashtag = false;
    var isRepeated = false;
    var isTooLong = false;

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
    var tooMuchItems = valueArr.length > 5;
    var hasItems = valueArr.length > 0;

    window.util.debounce(hashtagsSetValidity(evt, noHashtag, isRepeated, isTooLong, tooMuchItems, hasItems));
  }

  function hashtagsSetValidity(evt, noHashtag, isRepeated, isTooLong, tooMuchItems, hasItems) {
    var targetEl = evt.target;

    if (hasItems) {
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
    } else {
      targetEl.setCustomValidity('');
    }
  }

  function onCommentsInput(evt) {
    window.util.debounce(function () {
      var targetEl = evt.target;
      if (targetEl.validity.tooShort) {
        targetEl.setCustomValidity('Comment is too short');
      } else if (targetEl.validity.tooLong) {
        targetEl.setCustomValidity('Comment is too long');
      } else {
        targetEl.setCustomValidity('');
      }
    });
  }

  function onEscapeDown(evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      if (!(uploadOverlay.classList.contains('hidden'))) {
        if (!(commentsField === document.activeElement)) {
          closeUploadOverlay(evt);
        }
      }
    }
  }

// HANDLERS
  function onUploadInputClick() {
    openUploadOverlay();
  }
  function onCancelClick() {
    closeUploadOverlay();
    uploadInput.click();
  }

  uploadInput.addEventListener('change', onUploadInputClick);

})();
