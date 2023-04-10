chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getOptions') {
    chrome.storage.local.get(null, (options) => {
      sendResponse(options);
    });
    return true;
  }
});