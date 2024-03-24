chrome.runtime.onInstalled.addListener(async () => {
    const state = (await chrome.storage.local.get('badgeText'))["badgeText"] || "";
    await chrome.action.setBadgeText({text: state});
});