var style = document.createElement('style');
var url = window.location.href;
var _port;

style.id = 'custom-css-style';

function loadCustom() {
  console.log('loadCustom');
  chrome.storage.sync.get('CustomCSS', function(res) {
    if (res['CustomCSS']) {
      console.log(res['CustomCSS'])
      var saved = JSON.parse(res['CustomCSS']);

      style.innerText = saved.reduce(function(prev, item) { 
        if (item.url == url) {
          return prev + item.CSS;
        } else {
          return prev;
        }
      }, "");
    }
  });
}

loadCustom();
document.head.appendChild(style);

chrome.runtime.onMessage.addListener(function(msg) {
  if (msg === 'reload') {
    loadCustom();
  }
});

// chrome.runtime.onConnect.addListener(function(port) {
//   console.log('Port connected');
//   _port = port;
// 
//   port.onMessage.addListener(function(msg) {
//     console.log(msg);
//     if (msg === 'reload') {
//       loadCustom();
//     }
//   });
// });
