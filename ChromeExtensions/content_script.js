function onExtensionMessage(request) {
    if (request==undefined) {
      return;
    }
    if (request['彈幕'] != undefined) {
      if (!document.hasFocus()) {
        return;
      }
      proceed();
    }
  }
  
  function initContentScript() {
    //alert("auto");
    //doBackgroundJob();
    chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
      if (msg.action == '彈幕') {
        if (proceed())
          sendResponse({ successful: true });
        else
          sendResponse({ successful: false });
      }
    });
  }
  
  initContentScript();

  function proceed() {
      alert("按下後");
  }