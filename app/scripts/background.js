var themes,
    access_token = '?access_token=46ff7cc2b79637182d90c1d26bbfc60f16997484',
    path = [],
    downloadLinks = [],
    themeList = [];

var DownloadThemes = function() {
  fetch('https://api.github.com/repos/hanford/website-themes/contents' + access_token)
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    //Extract all paths
    json.map(function(item) {
      path.push(item.path);
    })
    downloadFull(path);
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
}

// Downloads full theme
function downloadFull(path) {
  path.map(function(instance) {
    fetch('https://api.github.com/repos/hanford/website-themes/contents/' + instance + '/theme.json' + access_token)
    .then(function(response) {
      return response.json()
    }).then(function(res) {
      fetch(res.download_url + access_token).then(function(response) {
        return response.json()
      }).then(function(res) {
        saveTheme(res)
      })
    })
  })
}

function saveTheme(theme) {
  themeList.push(theme);
  chrome.storage.sync.set({'VaneerThemes': JSON.stringify(themeList)})
}

DownloadThemes();
