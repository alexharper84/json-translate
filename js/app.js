"use strict";
var app = {};

app.data = {
  input: function() {
    return document.getElementById('input').value;
  },
  sl: function() {
    return document.getElementById('sourceLang').value;
  },
  tl: function() {
    return document.getElementById('targetLang').value;
  },
  api: function() {
    let sourceLanguage = app.data.sl();
    let targetLanguage = app.data.tl();
    return 'https://translate.googleapis.com/translate_a/single?client=gtx&sl='
            + sourceLanguage + '&tl=' + targetLanguage + '&dt=t&q=';
  }
}

app.translate = function() {
  let json = JSON.parse(app.data.input());
  let result = Object.assign({}, json);
  let keys = Object.keys(json);
  let processed = 0;

  keys.forEach(function(key) {
    let url = app.data.api() + encodeURI(json[key]);
    app.request(url).then(response => {
      return JSON.parse(response
                 .replace(/[,]+/g, ','))[0]
                 .map(function(elem){ return elem[0]; })
                 .join('');
    }).then(function(translation) {
      result[key] = translation;
      if (++processed === keys.length) {
        document.getElementById('output').value = JSON.stringify(result, null, 4);
      }
    }).catch(function(error) {
      document.getElementById('output').value = error;
    });
  });
}

app.request = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(this.responseText);
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.send();
  });
}
