window.tj={"pdd":"pdd"}

function updateCookie(currentCookie) {
  window.tj.pdd = currentCookie
}


chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log(request);
    chrome.cookies.getAll({
      url: request.url
    }, (cks) => {
      let cookie = cks.map((item) => {
          return item.name + "@@@" + item.value
        }).join(";") + ";";
      updateCookie(cookie)
    });
    sendResponse(window.tj.pdd);
  });