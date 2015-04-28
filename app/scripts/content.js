var styleEl = document.createElement('style');
chrome.storage.sync.get('CustomCSS', function(res) {
  console.log(styleEl);
  styleEl.innerText = res['CustomCSS'];
  document.head.appendChild(styleEl);
});
