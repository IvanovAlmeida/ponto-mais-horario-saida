try {
    chrome.action.onClicked.addListener(function () {
        chrome.tabs.create({ url: "https://app2.pontomais.com.br/meu-ponto" });
    });

    chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            console.info(details);
          return {cancel: details.url.contains("://api.pontomais.com.br/") != -1};
        },
        { urls: ["<all_urls>"] }
      );
} catch (ex) {
    console.error(ex);
}