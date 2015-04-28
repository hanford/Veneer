var completeBtn = document.querySelector('.complete');
var editor;

editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
  lineNumbers: true,
  mode: 'css',
});

chrome.storage.sync.get('CustomCSS', function (res) {
  editor.getDoc().setValue(res['CustomCSS']);
});

var newCSS = function() {
  var text = editor.getValue().replace(/\s+/g, ' ').trim();
  chrome.storage.sync.set({'CustomCSS': text}, function () {
     console.log("Just saved", text)
  });
};

completeBtn.addEventListener("click", newCSS);
