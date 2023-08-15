import { renderEntryForm } from "./entryForm.js"
import { collapseEntry } from "./entryView.js";
import { checkForUnsaved } from "./utils.js";


function createDropdown() {
  const dropdown = document.createElement("div");
  dropdown.classList.add("options-dropdown");
  return dropdown;
}

function createDropdownOption (pathToIcon, className, textContent, callBack) {
  const option = document.createElement('div')
  option.classList.add('options-dropdown-option', `${className}-option`)
  option.textContent= textContent
  const icon = optionIcon(pathToIcon)
  option.insertBefore(icon, option.firstChild )
  option.addEventListener('click', callBack)
  return option
}

function optionIcon (pathToIcon){
  const iconContainer = document.createElement('div')
  iconContainer.classList.add('dropdown-option-icon-container')
  const imageElement = document.createElement('img')
  imageElement.src = pathToIcon
  iconContainer.appendChild(imageElement)
  return iconContainer
}

function appendDropdown(event, entry) {
  const entryHead = entry.querySelector(".entry-head");
  const dropdown = createDropdown();
  dropdown.appendChild(createDropdownOption( '../images/edit.svg', 'edit', 'Edit', () => editEntry(entry)))
  dropdown.appendChild(createDropdownOption( '../images/copy.svg', 'duplicate', 'Make a copy', () => {duplicateEntry(entry)}))
  dropdown.appendChild(createDropdownOption( '../images/trash.svg', 'delete', 'Delete', deleteEntry))
  entryHead.appendChild(dropdown);
  entry.classList.add('options-dropdown-showing')
}

async function editEntry(entry) {
  let unsavedForms = checkForUnsaved()
  if (unsavedForms) {
    alert(`Currently working on document called: ${unsavedForms} , save or undo first`)
    return
  }
  const container = document.createElement('div')
  container.classList.add('edit-entry-form-container', 'entry-view')
  entry.classList.add('expanded-entry')
  // if entry view is open
  collapseEntry(entry)
  entry.appendChild(container)
  const entryContent = entry.getAttribute('data-content')
  const entryTitle = entry.getAttribute('data-title')
  const errors = []
  renderEntryForm(container, { entryContent, entryTitle, errors }, "PUT");
  
}
async function duplicateEntry(entry) {
  let unsavedForms = checkForUnsaved()
  if (unsavedForms) {
    alert(`Currently working on document called: ${unsavedForms} , save or undo first`)
    return
  }

  const entryContent = entry.getAttribute('data-content')
  const entryTitle = entry.getAttribute('data-title')
  const userId = entry.getAttribute('data-user')

  
  const response = await fetch(`/dashboard/duplicate/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      entry: entryContent,
      'entry-title': entryTitle,
    }),
  });

  const result = await response.json();

  if (result.success) {
    window.location.href = result.redirectUrl; // Redirect to the provided URL.
  } else {
    console.error("Failed to duplicate entry.");
  }

}

async function deleteEntry(event) {
  let entry = event.target.closest('.entry')
  let entryid = entry.getAttribute('data-id')
  console.log(entry)
  try {
    const response = await fetch(`/dashboard/${entryid}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error("Error deleting the entry.");
    }
    entry.parentNode.removeChild(entry)
  } catch (error) {
    console.error("There was an error:", error);
  }
}

function closeShowingDropdown() {
    const existingDropdown = document.querySelector('.options-dropdown');
    if (!existingDropdown) {
        return
    } else {
        existingDropdown.parentNode.removeChild(existingDropdown);
        const dropdownShowingEntry = document.querySelector('.options-dropdown-showing');
        if (dropdownShowingEntry) {
            dropdownShowingEntry.classList.remove('options-dropdown-showing');
        }
    }
}

function showOptions(event, entry) {
    closeShowingDropdown(); 
    appendDropdown(event, entry);
    document.addEventListener('click', function() {
      const dropdown = entry.querySelector('.options-dropdown')
      if (dropdown) {
        dropdown.parentNode.removeChild(dropdown);
        entry.classList.remove('options-dropdown-showing');
      }
    }, { once: true });
    event.stopPropagation(); // prevent bubbling up
  }

export { showOptions };