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

  var hashTags = uploadOverlay.querySelector('.upload-form-hashtags');
  var imageEffectBlock = document.querySelector('#upload-select-image');
  var commentsField = uploadOverlay.querySelector('.upload-form-description');

  var form = document.querySelector('#upload-select-image');

  window.currentFilter = null;

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
			['add', imageEffectBlock, 'change', onCommentChange],
			['add', imageEffectBlock, 'invalid', onCommentInvalid, true],
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
			['remove', imageEffectBlock, 'change', onCommentChange],
			['remove', imageEffectBlock, 'invalid', onCommentInvalid, true],
			['remove', hashTags, 'input', onHashtagsInput],
			['remove', commentsField, 'input', onCommentsInput]
    ]);
    uploadOverlay.classList.add('hidden');
  }


// SCALE OF UPLOAD OVERLAY PREVIEV IMAGE
  function changeElemScale(scaleValue) {
    imagePreview.style.transform = 'scale(' + scaleValue / 100 + ')';
  }
  window.initializeScale(resizeControls, changeElemScale);


// EFFECT LEVEL MOVEMENT
  function onLevelPinMove(start) {
    resetScale(resizeControls);

    var startCoords = {
      x: start
    };
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };
      startCoords = {
        x: moveEvt.clientX
      };

      var levelPersent = (levelPin.offsetLeft - shift.x) * 100 / levelMaxWidth;
      if (levelPersent <= 0) {
        levelPersent = 0;
        document.removeEventListener('mousemove', onMouseMove);
      } else if (levelPersent >= 100) {
        levelPersent = 100;
        document.removeEventListener('mousemove', onMouseMove);
      }

      levelPin.style.left = levelPersent + '%';
      levelLine.style.width = levelPersent + '%';

      window.changeLevel(levelPersent);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

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
