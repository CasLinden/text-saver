import { decodeHTML } from './utils.js'

function createEntryView(entry) {
    const container = document.createElement("div");
    container.classList.add("entry-view");
    const contentField = createEntryContentField(entry);
    container.appendChild(contentField);
    return container;
}

function createEntryContentField(entry) {
    const contentSection = document.createElement("pre");
    const content = entry.getAttribute("data-content");
    const decodedContent = decodeHTML(content)
    contentSection.textContent = decodedContent;
    contentSection.classList.add("entry-content");
    const id = entry.getAttribute("data-id");
    contentSection.setAttribute("data-id", id);
    return contentSection;
}

function expandEntry (entry) {
    const entryView = createEntryView(entry) 
    entry.appendChild(entryView)
}

function collapseEntry(entry){
    let entryView = entry.querySelector('.entry-view')
    if (entryView) {
    entry.removeChild(entryView)
    }
}


export {expandEntry, collapseEntry}
