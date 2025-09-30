// =========================
// Income Expense Calculator
// =========================

// ----------- Element Selectors -----------
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const addButton = document.getElementById('add-entry');
const resetButton = document.getElementById('reset-fields');
const entriesList = document.getElementById('entries-list');
const totalIncomeSpan = document.getElementById('total-income');
const totalExpensesSpan = document.getElementById('total-expenses');
const netBalanceSpan = document.getElementById('net-balance');
const filterRadios = document.querySelectorAll('input[name="filter"]');

// ----------- Data & State -----------
let entries = JSON.parse(localStorage.getItem('entries')) || [];
let editIndex = null; // Track index of entry being edited

// ----------- Render Entries List -----------
function renderEntries(filter = 'all') {
    entriesList.innerHTML = '';
    let filteredEntries = entries;

    // Filter entries based on selected filter
    if (filter === 'income') {
        filteredEntries = entries.filter(entry => entry.type === 'income');
    } else if (filter === 'expense') {
        filteredEntries = entries.filter(entry => entry.type === 'expense');
    }

    // Render each entry as a list item with smooth fade-in effect
    filteredEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        // Add class for background color based on entry type
        li.className = entry.type === 'income' ? 'entry-income' : 'entry-expense';
        li.innerHTML = `
            <span>${entry.description} - $${parseFloat(entry.amount).toFixed(2)}</span>
            <div class="actions">
                <button type="button" class="edit-btn" data-index="${index}">Edit</button>
                <button type="button" class="delete-btn" data-index="${index}">Delete</button>
            </div>
        `;
        // Add a slight delay for each item for a staggered animation effect
        li.style.animationDelay = `${index * 0.05}s`;
        entriesList.appendChild(li);
    });

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            startEditEntry(idx);
        });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            deleteEntry(idx);
        });
    });

    calculateTotals();
}

// ----------- Calculate and Display Totals -----------
function calculateTotals() {
    const totalIncome = entries
        .filter(entry => entry.type === 'income')
        .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    const totalExpenses = entries
        .filter(entry => entry.type === 'expense')
        .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    const netBalance = totalIncome - totalExpenses;

    // Add $ symbol before the values
    totalIncomeSpan.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpensesSpan.textContent = `$${totalExpenses.toFixed(2)}`;
    netBalanceSpan.textContent = `$${netBalance.toFixed(2)}`;
}

// ----------- Add or Update Entry -----------
addButton.addEventListener('click', () => {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    // Input validation
    if (!description) {
        alert('Description cannot be empty.');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Amount must be a positive number.');
        return;
    }

    if (editIndex !== null) {
        // Update existing entry
        entries[editIndex] = { description, amount, type };
        editIndex = null;
        addButton.textContent = 'Add Entry';
    } else {
        // Add new entry
        entries.push({ description, amount, type });
    }
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries(getCurrentFilter());
    descriptionInput.value = '';
    amountInput.value = '';
});

// ----------- Reset Input Fields -----------
resetButton.addEventListener('click', () => {
    descriptionInput.value = '';
    amountInput.value = '';
    typeSelect.value = 'income';
    editIndex = null;
    addButton.textContent = 'Add Entry';
});

// ----------- Start Editing an Entry -----------
function startEditEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;
    editIndex = index;
    addButton.textContent = 'Update Entry';
}

// ----------- Delete an Entry -----------
function deleteEntry(index) {
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries(getCurrentFilter());
}

// ----------- Get Current Filter Value -----------
function getCurrentFilter() {
    const checkedRadio = document.querySelector('input[name="filter"]:checked');
    return checkedRadio ? checkedRadio.value : 'all';
}

// ----------- Filter Entries on Radio Change -----------
filterRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        renderEntries(radio.value);
    });
});

// ----------- Initial Render -----------
renderEntries();
