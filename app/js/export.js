var list = document.querySelector('.list');

chrome.storage.sync.get('CustomCSS', function(res) {
  if (res['CustomCSS']) {
    var saved = JSON.parse(res['CustomCSS']);
    saved.map(function(item) {
      console.log(item)
      var li = document.createElement('li');
      var h2 = document.createElement('h2');
      var pre = document.createElement('pre');
      h2.innerText = item.url;
      pre.innerText = atob(item.CSS);
      li.appendChild(h2);
      li.appendChild(pre);
      list.appendChild(li);
    })
  }
});
