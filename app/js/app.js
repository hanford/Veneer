'use strict'

require('codemirror/mode/css/css')

const CodeMirror = require('codemirror')
const codeMirrorConfig = {
  theme: 'dope',
  lineNumbers: true,
  mode: 'css',
  tabSize: 2
}

const textArea = document.querySelector('textarea')
const editor = CodeMirror.fromTextArea(textArea, codeMirrorConfig)

class Veneer {
  constructor () {
    const completeBtn = document.querySelector('.complete')
    const removeBtn = document.querySelector('.remove')
    const settingsBtn = document.querySelector('.settings')
    const urlBar = document.querySelector('.url-bar')

    this.load = this.load.bind(this)
    this.removeStorage = this.removeStorage.bind(this)
    this.saveToStorage = this.saveToStorage.bind(this)
    this.newCSS = this.newCSS.bind(this)

    chrome.tabs.query({ active: true }, (tabs) => {
      let a = document.createElement('a')
      a.href = tabs[0].url
      this.currentUrl = urlBar.value = a.host

      editor.on('change', this.newCSS)
      settingsBtn.addEventListener('click', this.settings)
      removeBtn.addEventListener('click', this.removeStorage)
    })
  }

  load () {
    chrome.storage.sync.get('CustomCSS', (res) => {
      if (res['CustomCSS']) {
        try {
          JSON.parse(res['CustomCSS'])
            .map((item) => {
              if (item.url === this.currentUrl) {
                editor.getDoc().setValue(atob(item.CSS))
              }
            })
        } catch (e) {
          this.removeStorage()
        }
      }
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
          .filter((item) =>{
            return item.url === this.currentUrl
          })
          .map((item) => {
            changed = true
            item.CSS = btoa(editor.getValue())
            return item
          })
      }

      if (!changed) {
        var b64 = btoa(editor.getValue())

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

    chrome.storage.sync.getBytesInUse('CustomCSS', (res) => {
      document.querySelector('.storage').innerText = res + " / 8,192";
    })

    if (this.settingsToggle) {
      document.querySelector('.code-container').style.display = "none";
      document.querySelector('.settings-container').style.display = "block";
    } else {
      document.querySelector('.code-container').style.display = "block";
      document.querySelector('.settings-container').style.display = "none";
    }
  }
}

var veneer = new Veneer()

return veneer.load()
