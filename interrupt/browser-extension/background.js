chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.type === "close" && sender.tab) {
        chrome.tabs.remove(sender.tab.id);
    }
});