var style = document.createElement('style')
var url = window.location.origin

style.id = 'custom-css-style'

function loadCustom() {
  chrome.storage.sync.get('CustomCSS', function (res) {
    if (res['CustomCSS']) {
      var saved = JSON.parse(res['CustomCSS'])
      console.log(saved)
      style.innerText = saved.reduce(function (prev, item) {
        if (item.url === url) {
          console.log(item.CSS)
          var code = atob(item.CSS)
          return prev + code
        } else {
          return prev
        }
      }, '')
    }
  })
}

loadCustom()

document.head.appendChild(style)

chrome.runtime.onMessage.addListener(msg => msg === 'reload' && loadCustom())
