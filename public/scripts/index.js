import { expandEntry, collapseEntry } from "./entryView.js";
import { showOptions } from "./optionsDropdown.js";
import { renderEntryForm } from "./entryForm.js";
import { checkForUnsaved } from "./utils.js";

const entriesContainer = document.getElementById("entries-container");
const newEntryButton = document.getElementById("new-entry-button");

function handleEntryClick(event) {
  const entry = event.target.closest(".entry");

  // If options clicked
  if (event.target.closest(".options-icon-container")) {
    if (entry.classList.contains("options-dropdown-showing")) {
      return;
    }
    showOptions(event, entry);
    return;
  }

  // If options dropdown clicked
  if (event.target.closest(".options-dropdown")) return;

  if (!event.target.closest(".entry-head")) {
    return;
  }

  // Handle entry-head click
  if (
    entry.classList.contains("expanded-entry") &&
    !entry.classList.contains("being-edited")
  ) {
    collapseEntry(entry);
    entry.classList.remove("expanded-entry");
  } else if (!entry.classList.contains("expanded-entry")) {
    expandEntry(entry);
    entry.scrollIntoView({ behavior: "smooth", block: "start" });
    entry.classList.add("expanded-entry");
  }
}

entriesContainer.addEventListener("click", handleEntryClick);
newEntryButton.addEventListener("click", function (event) {
  let unsavedForms = checkForUnsaved()
  console.log(unsavedForms)
  if (unsavedForms) {
    alert(`Currently working on document named: ${unsavedForms}, save or undo first`)
    return
  }
  renderEntryForm();
  newEntryButton.style.display = "none"
});
