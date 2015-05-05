var themes;

function getThemes() {
  chrome.storage.sync.get('VaneerThemes', function(res) {
    // var themes = ;
    themes = JSON.parse(res['VaneerThemes']);
    domThemes()
  })
}

var domThemes = function() {
  var list = document.querySelector('.list');
  themes.map(function(item) {

      var liItem = document.createElement('li'),
          div = document.createElement('div'),
          title = document.createElement('span'),
          button = document.createElement('button');

      button.innerText = 'Download Theme';
      // Setting attribute for later use
      button.setAttribute("data", item.url)
      button.addEventListener("click", downloadTheme);
      // photo.src = json[0].download_url;
      title.innerText = item.url;
      div.appendChild(title);
      div.appendChild(button);
      liItem.appendChild(div);
      list.appendChild(liItem);
  })
}

var downloadTheme = function(event) {
  console.log(themes)
  themes.map(function(i) {
    if (i.url == event.srcElement.attributes["data"].nodeValue) {
      addTheme(i)
    }
  })
  // themes.map(function(userMe))
  // addTheme(json);
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

getThemes();
