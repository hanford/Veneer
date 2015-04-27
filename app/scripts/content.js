var html = document.querySelector('html');
html.style.webkitFontSmoothing = "antialiased";
chrome.storage.sync.get('CustomCSS', function(res) {
  console.log(res)
});
