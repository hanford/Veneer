var completeBtn = document.querySelector('.complete');
var removeBtn = document.querySelector('.remove');
var editor, currentUrl, storage, port;

editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
  theme: 'dope',
  lineNumbers: true,
  mode: 'css',
  tabSize: 2,
});

chrome.tabs.query({active: true},
  function(tabs) {
    currentUrl = tabs[0].url;
  }
);

function load() {
  chrome.storage.sync.get('CustomCSS', function (res) {
    if (res['CustomCSS']) {
      try {
        var saved = JSON.parse(res['CustomCSS']);
        console.log(saved);
        saved.map(function(item) {
          if (item.url == currentUrl) {
            editor.getDoc().setValue(item.CSS);
          }
        });
      } catch(e) {
        console.log('parse error');
        removeStorage();
        load();
      }
    }
  });
}

var removeStorage = function() {
  chrome.storage.sync.remove('CustomCSS', function(res) {
    console.log('done', res);
  })
}

var newCSS = function() {
  chrome.storage.sync.get('CustomCSS', function(res) {
    var changed = false;
    console.log('Add Called', res)
    if (!res['CustomCSS']) {
      storage = [];
    } else {
      storage = JSON.parse(res['CustomCSS']);
    }

    console.log(storage);

    storage.filter(function(item) {
      return item.url === currentUrl;
    }).map(function(item) {
      changed = true;
      item.CSS = editor.getValue();
      return item;
    });

    if (!changed) {
      storage.push({
        'url': currentUrl,
        'CSS': editor.getValue(),
      });
    }

    storage = JSON.stringify(storage);

    chrome.storage.sync.set({'CustomCSS': storage}, function (res) {
      console.log("saved", storage);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 'reload');
      });
    });
  });
};

completeBtn.addEventListener("click", newCSS);
removeBtn.addEventListener("click", removeStorage);

load();

