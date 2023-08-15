function decodeHTML(str) {
    var textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
}

function checkForUnsaved (targetElement = document) {
    const unsavedElement = targetElement.querySelector('.entry-form');
    if (unsavedElement){
        const entry = unsavedElement.closest('.entry')
        if (entry){
            const title = entry.getAttribute('data-title')
            return title
        }
        return "New Entry"
    }
    return false
}

export { decodeHTML, checkForUnsaved }