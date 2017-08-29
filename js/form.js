'use strict';

(function () {

  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadInput = document.querySelector('#upload-file');
  var buttonCancel = uploadOverlay.querySelector('.upload-form-cancel');
  var controls = uploadOverlay.querySelector('.upload-effect-controls');

  var level = uploadOverlay.querySelector('.upload-effect-level');
  var levelPin = level.querySelector('.upload-effect-level-pin');
  var levelLine = level.querySelector('.upload-effect-level-val');
  var levelDefault = 20;
  var levelMaxWidth = 455;

  var imagePreview = document.querySelector('.effect-image-preview');

  var resizeControls = uploadOverlay.querySelector('.upload-resize-controls');
  var buttonDecControl = resizeControls.querySelector('.upload-resize-controls-button-dec');
  var buttonIncControl = resizeControls.querySelector('.upload-resize-controls-button-inc');

  var hashTags = uploadOverlay.querySelector('.upload-form-hashtags');
  var imageEffectBlock = document.querySelector('#upload-select-image');
  var commentsField = uploadOverlay.querySelector('.upload-form-description');

  var currentFilter;

  function openUploadOverlay() {
    window.util.addRemoveHandlers([
			['add', buttonCancel, 'click', onCancelClick],
			['add', document, 'keydown', onEscapeDown],
			['add', buttonIncControl, 'click', onButtonResizeClick],
			['add', buttonDecControl, 'click', onButtonResizeClick],
			['add', imageEffectBlock, 'change', onCommentChange],
			['add', imageEffectBlock, 'invalid', onCommentInvalid, true],
			['add', hashTags, 'input', onHashtagsInput],
			['add', commentsField, 'input', onCommentsInput],
			['add', controls, 'click', onButtonResizeClick],
			['add', controls, 'click', itemEffectControlClick]
    ]);
    uploadOverlay.classList.remove('hidden');

    levelPin.classList.add('hidden');
    levelLine.classList.add('hidden');
  }

  function closeUploadOverlay() {
    window.util.addRemoveHandlers([
			['remove', buttonCancel, 'click', onCancelClick],
			['remove', document, 'keydown', onEscapeDown],
			['remove', buttonIncControl, 'click', onButtonResizeClick],
			['remove', buttonDecControl, 'click', onButtonResizeClick],
			['remove', imageEffectBlock, 'change', onCommentChange],
			['remove', imageEffectBlock, 'invalid', onCommentInvalid, true],
			['remove', hashTags, 'input', onHashtagsInput],
			['remove', commentsField, 'input', onCommentsInput],
			['remove', controls, 'click', itemEffectControlClick],
			['remove', controls, 'click', onButtonResizeClick]
    ]);
    uploadOverlay.classList.add('hidden');
  }


// SCALE OF UPLOAD OVERLAY PREVIEV IMAGE
  function onButtonResizeClick(evt) {
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
    if (element === controls) {
      controlValue = 100;
    }
    elementModyfiing.setAttribute('value', controlValue + '%');
    changeElemScale(imagePreview, controlValue);
  }

  function changeElemScale(element, scale) {
    var scaleValue = scale / 100;
    element.style.transform = 'scale(' + scaleValue + ')';
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

  function itemEffectControlClick(evt) {
    var element = evt.target;
    if (element.className === 'upload-effect-preview') {
      var elementStyle = element.parentNode.getAttribute('for').replace('upload-', '');
      addClassByControlClick(elementStyle);

      currentFilter = elementStyle.replace('effect-', '');

      if (elementStyle !== 'effect-none') {
        levelPin.classList.remove('hidden');
        levelLine.classList.remove('hidden');

        levelPin.style.left = levelDefault + '%';
        levelLine.style.width = levelDefault + '%';
      } else {
        levelPin.classList.add('hidden');
        levelLine.classList.add('hidden');
      }
      changeLevel(levelDefault);
    }
  }

  function addClassByControlClick(elementStyle) {
    var imagePreviewUploadOverlay = uploadOverlay.querySelector('.effect-image-preview');
    imagePreviewUploadOverlay.classList = '';
    imagePreviewUploadOverlay.classList.add('effect-image-preview');
    imagePreviewUploadOverlay.classList.add(elementStyle);
  }

  function onLevelPinMove(start) {
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

      var levelPersent = (levelPin.offsetLeft - shift.x) * 100 / levelMaxWidth; // 2
      if (levelPersent <= 0) {
        levelPersent = 0;
        document.removeEventListener('mousemove', onMouseMove);
      } else if (levelPersent >= 100) {
        levelPersent = 100;
        document.removeEventListener('mousemove', onMouseMove);
      }

      levelPin.style.left = levelPersent + '%'; // 2
      levelLine.style.width = levelPersent + '%'; // 2

      changeLevel(levelPersent);
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

  function changeLevel(percent) {
    var effectCoeff = {
      chrome: 'grayscale(' + 0.01 * percent + ')',
      sepia: 'sepia(' + 0.01 * percent + ')',
      marvin: 'invert(' + percent + '%)',
      phobos: 'blur(' + 0.05 * percent + 'px)',
      heat: 'brightness(' + 0.03 * percent + ')'
    };
    imagePreview.style = 'filter:' + effectCoeff[currentFilter];
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
