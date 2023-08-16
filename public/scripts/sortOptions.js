import { createDropdown, createDropdownOption } from './optionsDropdown.js'

const userEntriesHeader = document.querySelector('.user-entries-header');
const sortArrowUp = document.querySelector('.arrow-up');
const sortArrowDown = document.querySelector('.arrow-down');
const entriesContainer = document.querySelector('#entries-container');
const currentSortTypeDisplay = document.querySelector('.current-sort-type');
let sortDirection = 'desc'; 

function sortByLastEdit(a, b) {
    const dateA = new Date(a.dataset.lastEdit);
    const dateB = new Date(b.dataset.lastEdit);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
}

function sortByCreationDate(a, b) {
    const dateA = new Date(a.dataset.creationDate);
    const dateB = new Date(b.dataset.creationDate);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
}

function sortAlphabetically(a, b) {
    const titleA = a.dataset.title.toLowerCase();
    const titleB = b.dataset.title.toLowerCase();
    if (sortDirection === 'desc') {
        return titleA.localeCompare(titleB);
    } else {
        return titleB.localeCompare(titleA);
    }
}

function sortEntries(sortFunction) {
    const entries = Array.from(entriesContainer.querySelectorAll('.entry'));
    const sortedEntries = entries.sort(sortFunction);
    entriesContainer.innerHTML = '';
    sortedEntries.forEach(entry => entriesContainer.appendChild(entry));
}

function updateCurrentSortType(option) {
    currentSortTypeDisplay.textContent = option;
}

function appendSortDropdown() {
    const dropdown = createDropdown('sort-dropdown');
    dropdown.appendChild(createDropdownOption('../images/watch.svg', 'Last Edit', () => {
        sortEntries(sortByLastEdit);
        updateCurrentSortType('Last Edit');
    }));
    dropdown.appendChild(createDropdownOption('../images/calendar.svg', 'Creation Date', () => {
        sortEntries(sortByCreationDate);
        updateCurrentSortType('Creation Date');
    }));
    dropdown.appendChild(createDropdownOption('../images/type.svg', 'Alphabetically', () => {
        sortEntries(sortAlphabetically);
        updateCurrentSortType('Alphabetically');
    }));
    userEntriesHeader.appendChild(dropdown);
}

function toggleSortDirection(clickedArrow) {
    if (clickedArrow.classList.contains('active')) {
        return;
    }
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    
    sortArrowUp.classList.toggle('active');
    sortArrowDown.classList.toggle('active');
    reverseEntries()
}

sortArrowUp.addEventListener('click', () => {
    toggleSortDirection(sortArrowUp);
});

sortArrowDown.addEventListener('click', () => {
    toggleSortDirection(sortArrowDown);
});

function reverseEntries() {
    const entriesContainer = document.querySelector('#entries-container');
    const entries = Array.from(entriesContainer.querySelectorAll('.entry'));
    const reversedEntries = entries.reverse();
    
    entriesContainer.innerHTML = '';
    reversedEntries.forEach(entry => entriesContainer.appendChild(entry));
}

function showSortOptions(event) {
    appendSortDropdown();
    document.addEventListener('click', function(event) {
        const dropdown = document.querySelector('.options-dropdown');
        if (dropdown) {
          dropdown.parentNode.removeChild(dropdown);
        }
    }, { once: true });
    event.stopPropagation(); // prevent bubbling up
}


export { showSortOptions };