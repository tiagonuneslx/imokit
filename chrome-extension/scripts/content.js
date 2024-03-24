function setVisibilityForAgencyProperties(state) {
    if (window.location.href.startsWith("https://www.idealista.")) {
        if (state === "" && !!window.hideAgencyPropertiesInterval) {
            clearInterval(window.hideAgencyPropertiesInterval);
            window.hideAgencyPropertiesInterval = null;
        }
        const articleList = document.querySelector('section.items-container.items-list');
        if (articleList === null) {
            return;
        }
        const properties = [...articleList.querySelectorAll('article.item')];
        const propertiesFromAgency = properties.filter(article => article.querySelector("picture.logo-branding") !== null);
        const propertiesFromAgencyHighlights = propertiesFromAgency.map(article => {
            const previousSibling = article.previousElementSibling;
            if (previousSibling && previousSibling.tagName === "SPAN" && previousSibling.classList.contains("highlighted-text")) {
                return previousSibling;
            } else {
                return null;
            }
        }).filter(highlight => highlight !== null);
        const advertisements = articleList.querySelectorAll("article.adv");
        [...propertiesFromAgency, ...advertisements, ...propertiesFromAgencyHighlights].forEach(element => {
            if (state === "ON") {
                element.style.display = "none";
            } else {
                element.style = "";
            }
        });
    } else if (window.location.href.startsWith("https://supercasa.pt")) {
        const properties = document.querySelectorAll(".list-properties .property");
        const propertiesFromAgent = [...properties].filter(property => {
            const script = property.querySelector("script");
            if (!script) return;
            return script.textContent.trim().includes('"@type":"RealEstateAgent"');
        });
        [...propertiesFromAgent].forEach(element => {
            if (state === "ON") {
                element.style.display = "none";
            } else {
                element.style = "";
            }
        });
    } else if (window.location.href.startsWith("https://www.imovirtual.com/")) {
        const properties = document.querySelectorAll(".listing article.offer-item");
        const propertiesFromAgent = [...properties].filter(property => {
            const text = property.querySelector(".offer-item-details-bottom .pull-right");
            if (!text) return true;
            return text.textContent.trim() !== "Anúncio particular";
        });
        [...propertiesFromAgent].forEach(element => {
            if (state === "ON") {
                element.style.display = "none";
            } else {
                element.style = "";
            }
        });
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.state === "ON" && !window.hideAgencyPropertiesInterval) {
        window.hideAgencyPropertiesInterval = setInterval(() => setVisibilityForAgencyProperties(message.state), 200);
    } else if (message.state === "" && !!window.hideAgencyPropertiesInterval) {
        clearInterval(window.hideAgencyPropertiesInterval);
        window.hideAgencyPropertiesInterval = null;
    }
    setVisibilityForAgencyProperties(message.state);
});

async function contentScript(chrome) {
    const state = (await chrome.storage.local.get('badgeText'))["badgeText"] || "";

    if (state === "ON" && !window.hideAgencyPropertiesInterval) {
        window.hideAgencyPropertiesInterval = setInterval(() => setVisibilityForAgencyProperties(state), 200);
    } else if (state === "" && !!window.hideAgencyPropertiesInterval) {
        clearInterval(window.hideAgencyPropertiesInterval);
        window.hideAgencyPropertiesInterval = null;
    }
}

contentScript(chrome);