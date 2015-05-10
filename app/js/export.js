var list = document.querySelector('.installed'), saved;

chrome.storage.sync.get('CustomCSS', function(res) {
  if (res['CustomCSS'] != "[]" && res['CustomCSS'] != undefined) {
    saved = JSON.parse(res['CustomCSS']);
    saved.map(function(item) {
      var li = document.createElement('li');
      var h2 = document.createElement('h2');
      var pre = document.createElement('pre');
      var div = document.createElement('div');
      var remove = document.createElement('button');
      remove.innerText = 'REMOVE';
      h2.innerText = item.url;
      remove.setAttribute('data', item.url);
      remove.addEventListener('click', removeItem);
      pre.innerText = atob(item.CSS);
      div.classList.add('title-bar');
      h2.classList.add('pull-left');
      remove.classList.add('remove-bttn');
      div.appendChild(h2);
      div.appendChild(remove);
      li.appendChild(div);
      li.appendChild(pre);
      list.appendChild(li);
    })
  } else {
    list.innerText = 'No custom themes!';
  }
});

function removeItem(evt) {
  var doubleCheck = confirm('Are you sure you want to remove this theme?');
  if (doubleCheck == true) {
    var strg = [];
    var url = evt.srcElement.attributes[0].nodeValue;
    for (var i = 0; i < saved.length; i++) {
      if (url == saved[i].url) {
        console.log(saved[i])
      } else {
        strg.push(saved[i])
      }
    }
    chrome.storage.sync.set({'CustomCSS': JSON.stringify(strg)}, function (res) {
      console.log("saved", strg);
      location.reload();
    });
  } else {
    console.log('canceled!');
  }
}
