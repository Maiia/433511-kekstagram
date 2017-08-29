'use strict';

(function () {

  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadInput = document.querySelector('#upload-file');
  var buttonCancel = uploadOverlay.querySelector('.upload-form-cancel');
  var controls = uploadOverlay.querySelector('.upload-effect-controls');

  var resizeControls = uploadOverlay.querySelector('.upload-resize-controls');
  var buttonDecControl = resizeControls.querySelector('.upload-resize-controls-button-dec');
  var buttonIncControl = resizeControls.querySelector('.upload-resize-controls-button-inc');

  var hashTags = uploadOverlay.querySelector('.upload-form-hashtags');
  var imageEffectBlock = document.querySelector('#upload-select-image');
  var commentsField = uploadOverlay.querySelector('.upload-form-description');


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
			['add', controls, 'click', itemEffectControlClick]
    ]);
    uploadOverlay.classList.remove('hidden');
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
			['remove', controls, 'click', itemEffectControlClick]
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
    var imagePreviewResize = document.querySelector('.effect-image-preview');
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
    changeElemScale(imagePreviewResize, controlValue);
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
