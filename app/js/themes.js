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
    const list = document.querySelector('.card-container')

    this.themes.forEach((item, index) => {
      let div = document.createElement('div')
      let removeBtn = document.createElement('button')

      removeBtn.innerHTML = '&#x2715';
      removeBtn.addEventListener('click', () => this.removeTheme(event, index))
      removeBtn.classList.add('xbttn')

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
    const confirm = window.confirm(`Are you sure you want to deconste your theme for ${this.themes[index].url}?`)
    if (confirm) {
      this.themes[index] = {}
      chrome.storage.sync.set({'CustomCSS': JSON.stringify(this.themes)}, () => {
        event.target.parentElement.classList.add('swoosh-out')
        setTimeout(() => event.target.parentElement.remove(), 500)
      })
    }
  }
}

new Themes()
