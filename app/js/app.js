'use strict'

require('codemirror/mode/css/css')

const CodeMirror = require('codemirror')
const url = require('url')

const textArea = document.querySelector('textarea')
const editor = CodeMirror.fromTextArea(textArea, {
  theme: 'dope',
  lineNumbers: true,
  mode: 'css',
  tabSize: 2
})

class Veneer {
  constructor () {
    const completeBtn = document.querySelector('.complete')
    const removeBtn = document.querySelector('.remove')
    const settingsBtn = document.querySelector('.settings')
    const urlBar = document.querySelector('.url-bar')
    const themeBtn = document.querySelector('.theme-btn')

    this.load = this.load.bind(this)
    this.removeStorage = this.removeStorage.bind(this)
    this.saveToStorage = this.saveToStorage.bind(this)
    this.newCSS = this.newCSS.bind(this)

    chrome.tabs.query({ active: true }, (tabs) => {
      this.currentUrl = urlBar.value = url.parse(tabs[0].url).host

      editor.on('change', this.newCSS)
      themeBtn.addEventListener('click', this.themes)
      settingsBtn.addEventListener('click', this.settings)
      removeBtn.addEventListener('click', this.removeStorage)
    })
  }

  load () {
    chrome.storage.sync.get('CustomCSS', (res) => {
      if (res['CustomCSS']) {
        try {
          JSON.parse(res['CustomCSS'])
            .map((item) => item.url === this.currentUrl && editor.getDoc().setValue(atob(item.CSS)))
        } catch (e) {
          this.removeStorage()
        }
      }
    })
  }

  themes () {
    chrome.tabs.create({url:"../templates/themes.html"}, function (tab) {
      console.log(tab)
    })
  }


  removeStorage () {
    chrome.storage.sync.remove('CustomCSS', () => {
      chrome.storage.sync.getBytesInUse('CustomCSS', (res) => {
        document.querySelector('.storage').innerText = res + " Bytes"
      })
    })
  }

  saveToStorage (storage) {
    chrome.storage.sync.set({'CustomCSS': storage}, (res) => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        return chrome.tabs.sendMessage(tabs[0].id, 'reload')
      })
    })
  }

  newCSS (c) {
    chrome.storage.sync.get('CustomCSS', (res) => {
      let changed = false
      let storage

      if (!res['CustomCSS']) {
        storage = []
      } else {
        storage = JSON.parse(res['CustomCSS'])

        storage
          .filter(item => item.url === this.currentUrl)
          .map((item) => {
            changed = true
            item.CSS = btoa(editor.getValue())
            return item
          })
      }

      if (!changed) {
        let b64 = btoa(editor.getValue())

        storage.push({
          'url': this.currentUrl,
          'CSS': b64,
        })
      }

      return this.saveToStorage(JSON.stringify(storage))
    })
  }

  settings () {
    this.settingsToggle = !this.settingsToggle
    let codeContainer = document.querySelector('.code-container')
    let settingsContainer = document.querySelector('.settings-container')
    let storageMeter = document.querySelector('.storage')

    chrome.storage.sync.getBytesInUse('CustomCSS', usedSpace => storageMeter.innerText = `${usedSpace} / 8,192`)

    if (this.settingsToggle) {
      codeContainer.style.display = 'none'
      settingsContainer.style.display = 'block'
    } else {
      codeContainer.style.display = 'block'
      settingsContainer.style.display = 'none'
    }
  }
}

var veneer = new Veneer()

return veneer.load()
