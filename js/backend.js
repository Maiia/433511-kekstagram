'use strict';

window.backend = (function () {

  var SERVER_URL = 'https://1510.dump.academy/kekstagram';

  function setup(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000;

    return xhr;
  }

  function load(onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('GET', SERVER_URL + '/data');
    xhr.send();
  }

  function save(data, onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('POST', SERVER_URL);
    xhr.send(data);
  }

  return {
    load: load,
    save: save
  };

})();
