chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ pinnedTabs: {} });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get('pinnedTabs', (data) => {
    let pinnedTabs = data.pinnedTabs;
    if (pinnedTabs[tab.url]) {
      delete pinnedTabs[tab.url];
      chrome.tabs.update(tab.id, { pinned: false });
    } else {
      const maxOrder = Math.max(0, ...Object.values(pinnedTabs)) + 1;
      pinnedTabs[tab.url] = maxOrder;
      chrome.tabs.update(tab.id, { pinned: true });
    }
    chrome.storage.sync.set({ pinnedTabs });
  });
});

chrome.windows.onCreated.addListener(() => {
  chrome.storage.sync.get('pinnedTabs', (data) => {
    const pinnedTabs = data.pinnedTabs;
    const sortedUrls = Object.keys(pinnedTabs).sort((a, b) => pinnedTabs[a] - pinnedTabs[b]);
    
    sortedUrls.forEach((url) => {
      chrome.tabs.create({ url, pinned: true });
    });

    // After opening all the pinned tabs, activate the default tab (index 0)
    chrome.tabs.query({ active: false, windowType: "normal", currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true });
      }
    });
  });
});