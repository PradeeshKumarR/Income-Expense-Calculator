//Selecting elements
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const addButton = document.getElementById('add-entry');
const resetButton = document.getElementById('reset-fields');
const totalIncomeSpan = document.getElementById('total-income');
const totalExpenseSpan = document.getElementById('total-expense');
const netBalanceSpan = document.getElementById('net-balance');
const entriesList = document.getElementById('entries-list');
const filterRadios = document.querySelectorAll('input[name="filter"]');

//Load entries from local storage
let entries = JSON.parse(localStorage.getItem('entries')) || [];

// Function to render entries
function renderEntries(filter = 'all') {
    entriesList.innerHTML = '';
    let filteredEntries = entries;

    if (filter === 'income') {
        filteredEntries = entries.filter(entry => entry.type === 'income');
    } else if (filter === 'expense') {
        filteredEntries = entries.filter(entry => entry.type === 'expense');
    }

    filteredEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.classList.add(entry.type);
        li.innerHTML = `
        <span>${entry.description} - $${entry.amount}</span>
        <div class="actions">
        <button type="button" class="edit" onclick="editEntry(${index})">Edit</button>
        <button type="button" class="delete" onclick="deleteEntry(${index})">Delete</button>
        <div/>
        `;
        entriesList.appendChild(li);
    });

    calculateTotals();
}

// Function to calculate totals
function calculateTotals() {
    const totalIncome = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    const totalExpense = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    const netBalance = totalIncome - totalExpense;

    totalIncomeSpan.innerHTML = `$ ${totalIncome.toFixed(2)}`;
    totalExpenseSpan.innerHTML = `$ ${totalExpense.toFixed(2)}`;
    netBalanceSpan.innerHTML = `$ ${netBalance.toFixed(2)}`;
}

//Add Entry
addButton.addEventListener('click', () => {
    const description = descriptionInput.value;
    const amount = amountInput.value;
    const type = typeSelect.value;

    if (description && !isNaN(amount)) {
        entries.push({ description, amount, type });
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
        descriptionInput.value = '';
        amountInput.value = '';
    }
})

//Reset input fields
resetButton.addEventListener('click', () => {
    descriptionInput.value = '';
    amountInput.value = '';
})

//Edit entry
function editEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;
    deleteEntry(index); //remove the original entry and let the user update it
}

//Delete entry
function deleteEntry(index) {
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
}

//Filter entries
filterRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        renderEntries(radio.value);
    })
});

// Initial render
renderEntries();
