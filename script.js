let addons = [];

const addonsContainer = document.querySelector('.addons-container');

function showError(message) {
    addonsContainer.innerHTML = '';

    const errorElement = document.createElement('p');
    errorElement.textContent = message;
    errorElement.style.color = "red";
    errorElement.style.fontSize = "24px";
    errorElement.style.fontWeight = "bold";

    addonsContainer.appendChild(errorElement);
}

async function copyCodeToClipboard(fileUrl) {
    try {
        const response = await fetch(fileUrl);
        const code = await response.text();

        await navigator.clipboard.writeText(code);

        alert("Код успешно скопирован!");
    } catch (error) {
        console.error(error);
        alert("Не удалось скопировать код.");
    }
}

function renderAddons(addonsToRender) {
    addonsContainer.innerHTML = "";

    if (!addonsToRender.length) {
        showError("Ничего не найдено!");
        return;
    }

    addonsToRender.forEach(addon => {

        const addonElement = document.createElement("div");
        addonElement.className = "addon";

        if (addon.image) {
            const image = document.createElement("img");
            image.src = addon.image;
            image.alt = addon.name;
            addonElement.appendChild(image);
        }

        const title = document.createElement("h3");
        title.textContent = addon.name;
        addonElement.appendChild(title);

        if (addon.author) {
            const author = document.createElement("p");
            author.innerHTML = `Автор: <a href="${addon.authorLink}" target="_blank">${addon.author}</a>`;
            addonElement.appendChild(author);
        }

        const description = document.createElement("p");
        description.textContent = addon.description;
        addonElement.appendChild(description);

        const buttons = document.createElement("div");
        buttons.className = "buttons-container";

        const download = document.createElement("a");
        download.href = addon.file;
        download.download = "";
        download.className = "download-button";
        download.textContent = "Скачать";

        const copy = document.createElement("button");
        copy.className = "copy-button";
        copy.textContent = "Копировать код";
        copy.onclick = () => copyCodeToClipboard(addon.file);

        const details = document.createElement("a");
        details.className = "download-button details-button";
        details.textContent = "Подробнее";
        details.href = "?addon=" + encodeURIComponent(addon.name);

        buttons.appendChild(download);
        buttons.appendChild(copy);
        buttons.appendChild(details);

        addonElement.appendChild(buttons);

        addonsContainer.appendChild(addonElement);

    });
}

function filterAddons() {

    const value = document.getElementById("search").value.toLowerCase();

    const filtered = addons.filter(addon =>
        addon.name.toLowerCase().includes(value) ||
        addon.description.toLowerCase().includes(value)
    );

    renderAddons(filtered);
}

function renderAddonPage(addon) {

    document.getElementById("main-header").style.display = "none";
    document.getElementById("links-section").style.display = "none";
    document.getElementById("addons-page").style.display = "none";
    document.getElementById("addon-page").style.display = "block";

    document.getElementById("addon-image").src = addon.image;
    document.getElementById("addon-image").alt = addon.name;

    document.getElementById("addon-title").textContent = addon.name;

    document.getElementById("addon-description").textContent = addon.description;

    if (addon.author) {
        document.getElementById("addon-author").innerHTML =
            `Автор: <a href="${addon.authorLink}" target="_blank">${addon.author}</a>`;
    }

    const download = document.getElementById("download-button");
    download.href = addon.file;

    document.getElementById("copy-button").onclick = () => {
        copyCodeToClipboard(addon.file);
    };

    document.getElementById("back-button").onclick = () => {
        location.href = "index.html";
    };
}

function loadPage() {

    addons = window.addons || [];

    const params = new URLSearchParams(window.location.search);
    const addonName = params.get("addon");

    if (addonName) {

        const addon = addons.find(a => a.name === addonName);

        if (addon) {
            renderAddonPage(addon);
        } else {
            showError("Дополнение не найдено.");
        }

    } else {

        renderAddons(addons);

    }

}

window.onload = loadPage;
