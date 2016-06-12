'use strict'

const CodeMirror = require('codemirror')
require('codemirror/mode/css/css')
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
    var settingsToggle
    this.currentUrl

    chrome.tabs.query({active: true}, tabs => {
        var a = document.createElement('a')
        a.href = tabs[0].url
        this.currentUrl = a.hostname
        urlBar.value = this.currentUrl
      }
    )

    editor.on('change', this.newCSS)
    settingsBtn.addEventListener('click', this.settings)
    removeBtn.addEventListener('click', this.removeStorage)

    this.load()
  }

  load () {
    console.log('HERE!')
    chrome.storage.sync.get('CustomCSS', (res) => {
      if (res['CustomCSS']) {
        try {
          var saved = JSON.parse(res['CustomCSS'])
          saved.map((item) => {
            if (item.url == this.currentUrl) {
              editor.getDoc().setValue(atob(item.CSS));
            }
          })
        } catch(e) {
          this.removeStorage()
        }
      }
    })
  }

  removeStorage () {
    chrome.storage.sync.remove('CustomCSS', function() {
      chrome.storage.sync.getBytesInUse('CustomCSS', function (res) {
        document.querySelector('.storage').innerText = res + " Bytes"
      })
    })
  }

  saveToStorage (strg) {
    chrome.storage.sync.set({'CustomCSS': strg}, function (res) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 'reload')
      })
    })
  }

  newCSS (c) {
    return chrome.storage.sync.get('CustomCSS', (res) => {
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

      let b64 = btoa(editor.getValue())

      if (!changed) {
        storage.push({
          'url': this.currentUrl,
          'CSS': b64,
        })
      }

      storage = JSON.stringify(storage)

      return this.saveToStorage(storage)
    })
  }

  settings () {
    this.settingsToggle = !this.settingsToggle;
    chrome.storage.sync.getBytesInUse('CustomCSS', function (res) {
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

new Veneer()
