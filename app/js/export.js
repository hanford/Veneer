var list = document.querySelector('.list'), saved;

function showStorage() {
  chrome.storage.sync.get('CustomCSS', function(res) {
    if (res['CustomCSS']) {
      saved = JSON.parse(res['CustomCSS']);
      saved.map(function(item) {
        var li = document.createElement('li');
        var h2 = document.createElement('h2');
        var pre = document.createElement('pre');
        var remove = document.createElement('button');
        remove.innerText = 'X';
        h2.innerText = item.url;
        remove.setAttribute('data', item.url);
        remove.addEventListener("click", removeItem);
        pre.innerText = atob(item.CSS);
        li.appendChild(h2);
        li.appendChild(remove);
        li.appendChild(pre);
        list.appendChild(li);
      })
    }
  });
}

showStorage();

function removeItem(evt) {
  var strg = [];
  var url = evt.srcElement.attributes[0].nodeValue;
  for (var i = 0; i < saved.length; i++) {
    if (url == saved[i].url) {
      console.log(saved[i])
    } else {
      strg.push(saved[i])
    }
  }
  debugger
  chrome.storage.sync.set({'CustomCSS': JSON.stringify(strg)}, function (res) {
    console.log("saved", strg);
    showStorage();
  });
}
