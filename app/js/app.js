var completeBtn = document.querySelector('.complete');
var removeBtn = document.querySelector('.remove');
var editor, currentUrl, storage;

editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
  theme: 'zenburn',
  lineNumbers: true,
  mode: 'css',
  tabSize: 2,
});

chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
  function(tabs) {
    currentUrl = tabs[0].url;
  }
);

chrome.storage.sync.get('CustomCSS', function (res) {
  if (res['CustomCSS']) {
    var saved = JSON.parse(res['CustomCSS']);
    for (var i = 0; saved.length > i; i++) {
      if (saved[i].url == currentUrl) {
        console.log(saved[i]);
        editor.getDoc().setValue(saved[i].CSS);
      }
    }
  }
});

var removeStorage = function() {
  chrome.storage.sync.remove('CustomCSS', function(res) {
    console.log('done', res);
  })
}

var newCSS = function() {
  chrome.storage.sync.get('CustomCSS', function(res) {
    console.log('Add Called', res)
    if (!res['CustomCSS']) {
      storage = [];
    } else {
      storage = JSON.parse(res['CustomCSS']);
    }

    console.log(storage);

    var CSSFile = {
      'url': currentUrl,
      'CSS': editor.getValue() //.replace(/\s+/g, ' ').trim()
    }

    storage.push(CSSFile);

    storage = JSON.stringify(storage);

    chrome.storage.sync.set({'CustomCSS': storage}, function (res) {
      console.log("saved", storage);
    });
  });
};

completeBtn.addEventListener("click", newCSS);
removeBtn.addEventListener("click", removeStorage)
