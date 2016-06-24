var themes
var importBtn = document.querySelector('.import')

function getThemes() {
  chrome.storage.sync.get('CustomCSS', function (res) {
    try {
      themes = JSON.parse(res['CustomCSS'])
    }
    catch (e) {
      console.log('No Themes!')
    }
    domThemes()
  })
}

var domThemes = function() {
  var list = document.querySelector('.card-container')

  themes.forEach(function(item) {
    var div = document.createElement('div')

    div.innerText = item.url
    div.classList.add('card')
    list.appendChild(div)
  })
}

function saveToStorage(strg) {
  chrome.storage.sync.set({'CustomCSS': strg}, function (res) {
    console.log("saved", strg);
    location.reload();
  });
}

getThemes()
