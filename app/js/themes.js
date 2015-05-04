var themes;
var access_token = '?access_token=46ff7cc2b79637182d90c1d26bbfc60f16997484';

var githubThemes = function() {
  fetch('https://api.github.com/repos/hanford/website-themes/contents' + access_token)
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('theme response', json)
    themes = json;
    domThemes();
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
}

var domThemes = function() {
  var list = document.querySelector('.list');
  themes.map(function(item) {
    fetch('https://api.github.com/repos/hanford/website-themes/contents/' + item.path  + access_token)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      var liItem = document.createElement('li');
      var photo = document.createElement('img');
      var div = document.createElement('div');
      var title = document.createElement('span');
      var button = document.createElement('button');
      button.innerText = 'Download Theme';
      // Setting attribute for later use
      button.setAttribute("data", json[1].path)
      button.addEventListener("click", downloadTheme);
      photo.src = json[0].download_url;
      title.innerText = item.name;
      div.appendChild(title);
      div.appendChild(button);
      liItem.appendChild(photo);
      liItem.appendChild(div);
      list.appendChild(liItem);
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })
    // var btn = document.querySelectorAll('button');
    // console.log(btn)
  })
}

var downloadTheme = function(event) {
  console.log(event.srcElement.attributes["data"].nodeValue);
  fetch('https://raw.githubusercontent.com/hanford/website-themes/master/' + event.srcElement.attributes["data"].nodeValue + access_token)
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    addTheme(json);
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
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

githubThemes();
