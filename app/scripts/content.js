var styleEl = document.createElement('style');
var url = window.location.href;
chrome.storage.sync.get('CustomCSS', function(res) {
  if (res['CustomCSS']) {
    var saved = JSON.parse(res['CustomCSS']);
    for (var i = 0; saved.length > i; i++) {
      if (saved[i].url == url) {
        styleEl.innerText = saved[i].CSS;
        document.head.appendChild(styleEl);
      }
    }
  }
});
