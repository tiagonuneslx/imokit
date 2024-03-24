window.onload = async function () {
    const switchLabel = document.getElementById('switchLabel');
    const hidePropertiesSwitch = document.getElementById('hidePropertiesSwitch');
    const userLang = navigator.language || navigator.userLanguage;

    if (userLang === 'pt-PT' || userLang === 'pt-BR') {
        switchLabel.textContent = 'Ocultar artigos de Agentes';
    }

    const prevState = (await chrome.storage.local.get('badgeText'))["badgeText"] || "";
    hidePropertiesSwitch.checked = prevState === "ON";
    setTimeout(() => {
        hidePropertiesSwitch.classList.remove('no-transition');
    }, 300);

    hidePropertiesSwitch.addEventListener('change', async function () {
        const nextState = this.checked ? "ON" : "";
        await chrome.storage.local.set({badgeText: nextState});

        const tabs = await chrome.tabs.query({});
        for (let i = 0; i < tabs.length; i++) {
            try {
                await chrome.tabs.sendMessage(tabs[i].id, {state: nextState});
            } catch (e) {
                console.log(e);
            }
        }
        await chrome.action.setBadgeText({text: nextState});
    });
}