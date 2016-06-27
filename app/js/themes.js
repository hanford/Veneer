class Themes {
  constructor () {
    chrome.storage.sync.get('CustomCSS', (res) => {
      try {
        this.themes = JSON.parse(res['CustomCSS'])
        this.appendThemesToDom()
      }
      catch (e) {
        console.log('No Themes!')
      }
    })

    this.appendThemesToDom.bind(this)
    this.saveToStorage.bind(this)
    this.removeTheme.bind(this)
  }

  appendThemesToDom () {
    let list = document.querySelector('.card-container')

    this.themes.forEach((item, index) => {
      let div = document.createElement('div')
      let removeBtn = document.createElement('button')

      removeBtn.innerText = 'X' //&#x2715;
      removeBtn.addEventListener('click', () => this.removeTheme(event, index))

      div.innerText = item.url
      div.appendChild(removeBtn)
      div.classList.add('card')
      list.appendChild(div)
    })
  }

  saveToStorage (strg) {
    chrome.storage.sync.set({'CustomCSS': strg}, (res) => location.reload())
  }

  removeTheme (event, index) {
    let confirm = window.confirm(`Are you sure you want to delete your theme for ${this.themes[index].url}?`)
    if (confirm) {
      chrome.storage.sync.set({'CustomCSS': strg}, (res) => location.reload()) 
    }
  }
}

new Themes()
