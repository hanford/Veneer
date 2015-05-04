var completeBtn = document.querySelector('.complete');
var removeBtn = document.querySelector('.remove');
var exportBtn = document.querySelector('.export');
var settingsBtn = document.querySelector('.settings');
var importBtn = document.querySelector('.import');
var editor, currentUrl, storage, port, settingsToggle;

editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
  theme: 'dope',
  lineNumbers: true,
  mode: 'css',
  tabSize: 2,
});

chrome.tabs.query({active: true},
  function(tabs) {
    var a = document.createElement('a');
    a.href = tabs[0].url;
    currentUrl = a.hostname;
    document.querySelector('.url-bar').value = currentUrl;
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
  chrome.storage.sync.remove('CustomCSS', function() {
    console.log('done');
  })
}

var exportStorage = function() {
  chrome.tabs.create({url:"../templates/export.html"}, function(tab) {
    console.log(tab)
  });
}

var importStorage = function() {
  chrome.tabs.create({url:"../templates/import.html"}, function(tab) {
    console.log(tab)
  });
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

    saveToStorage(storage);
  });
};

var settings = function() {
  settingsToggle = !settingsToggle;
  if (settingsToggle) {
    document.querySelector('.code-container').style.display = "none";
    document.querySelector('.settings-container').style.display = "block";
  } else {
    document.querySelector('.code-container').style.display = "block";
    document.querySelector('.settings-container').style.display = "none";
  }
}

function addTheme(contents) {
  chrome.storage.sync.get('CustomCSS', function(res) {
    var changed = false;
    console.log('Add Called', res)
    if (!res['CustomCSS']) {
      storage = [];
    } else {
      storage = JSON.parse(res['CustomCSS']);
    }
    storage.push(contents);

    storage = JSON.stringify(storage);

    saveToStorage(storage);
  })
}

function saveToStorage(strg) {
  chrome.storage.sync.set({'CustomCSS': strg}, function (res) {
    console.log("saved", strg);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, 'reload');
    });
  });
}

function readFile(evt) {
   var f = evt.target.files[0];
   if (f) {
     var r = new FileReader();
     r.onload = function(e) {
       var contents = e.target.result;
       console.log(contents)
       contents = JSON.parse(contents);
       addTheme(contents);
     }
     r.readAsText(f);
   }
 }



// importBtn.addEventListener("click", importStorage);
document.getElementById('file').addEventListener('change', readFile);
exportBtn.addEventListener("click", exportStorage);
settingsBtn.addEventListener("click", settings);
completeBtn.addEventListener("click", newCSS);
removeBtn.addEventListener("click", removeStorage);

load();
