var completeBtn = document.querySelector('.complete');
var removeBtn = document.querySelector('.remove');
var settingsBtn = document.querySelector('.settings');

var themeBrowse = document.querySelector('.theme-page');
var editor, currentUrl, storage, port, settingsToggle;

editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
  theme: 'dope',
  lineNumbers: true,
  mode: 'css',
  tabSize: 2,
});

editor.on("change", function(c) {
  debounce(newCSS(), 1000);
})

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
            editor.getDoc().setValue(atob(item.CSS));
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
    chrome.storage.sync.getBytesInUse('CustomCSS', function(res) {
      document.querySelector('.storage').innerText = res + " Bytes"
    })
  })
}

var themePage = function() {
  chrome.tabs.create({url:"../templates/theme.html"}, function(tab) {
    console.log(tab)
  });
}

var newCSS = function() {
  chrome.storage.sync.get('WebsiteList', function(res) {
    console.log(res['WebsiteList'])
    var changed = false;

    if (!res['WebsiteList']) {
      storage = [];
    } else {
      storage = JSON.parse(res['WebsiteList']);
    }

    storage.filter(function(item) {
      console.log("filter", item)
      return item === currentUrl;
    }).map(function(item) {
      changed = true;
      item.CSS = btoa(editor.getValue());
      return item;
    });

    var b64 = btoa(editor.getValue());
    if (!changed) {
      storage.push(currentUrl);
    }

    storage = JSON.stringify(storage);

    console.log("storage", storage);

    saveToList(storage);
  });
};

var settings = function() {
  settingsToggle = !settingsToggle;
  chrome.storage.sync.getBytesInUse('CustomCSS', function(res) {
    document.querySelector('.storage').innerText = res + " / 8,192";
  })

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

function saveToList(strg) {
  console.log("presave", strg);
  chrome.storage.sync.set({'WebsiteList': strg}, function (res) {
    console.log("postsave", strg);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, 'reload');
    });
  });
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// function callupdate() {
//   debounce(updateThemes(), 500);
// }

// function updateThemes() {
//   chrome.extension.sendRequest({msg: 'updateThemes'});
// }


// importBtn.addEventListener("click", importStorage);

themeBrowse.addEventListener("click", themePage);
settingsBtn.addEventListener("click", settings);
removeBtn.addEventListener("click", removeStorage);

load();
