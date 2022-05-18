chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: "https://app2.pontomais.com.br/meu-ponto" });
})