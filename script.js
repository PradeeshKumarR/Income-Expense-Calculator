const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addEntryBtn = document.getElementById('addEntry');
const resetBtn = document.getElementById('resetButton');
const entriesList = document.getElementById('entriesList');
const totalIncomeSpan = document.getElementById('totalIncome');
const totalExpenseSpan = document.getElementById('totalExpense');
const netBalanceSpan = document.getElementById('netBalance');
const filterRadios = document.querySelectorAll('input[name="filter"]');

let entries = JSON.parse(localStorage.getItem('entries')) || [];

function updateLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

function updateSummary() {
    const totalIncome = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpense = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
    const netBalance = totalIncome - totalExpense;

    totalIncomeSpan.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpenseSpan.textContent = `$${totalExpense.toFixed(2)}`;
    netBalanceSpan.textContent = `$${netBalance.toFixed(2)}`;
}

function renderEntries() {
    entriesList.innerHTML = '';
    const filter = Array.from(filterRadios).find(radio => radio.checked).value;

    const filteredEntries = filter === 'all' ? entries : entries.filter(entry => entry.type === filter);

    filteredEntries.forEach(entry => {
        const li = document.createElement('li');
        li.classList.add(entry.type);

        const description = document.createElement('span');
        description.textContent = `${entry.description}: $${entry.amount.toFixed(2)}`;

        const actions = document.createElement('div');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editEntry(entry.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteEntry(entry.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(description);
        li.appendChild(actions);

        entriesList.appendChild(li);
    });

    updateSummary();
}

function addEntry() {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);

    if (!description || isNaN(amount)) {
        alert('Please provide valid description and amount.');
        return;
    }

    const newEntry = {
        id: Date.now(),
        description,
        amount,
        type: amount >= 0 ? 'income' : 'expense',
    };

    entries.push(newEntry);
    updateLocalStorage();
    renderEntries();

    descriptionInput.value = '';
    amountInput.value = '';
}

function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;

    deleteEntry(id); // Remove the entry to allow for updating it later
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    updateLocalStorage();
    renderEntries();
}

function resetInputs() {
    descriptionInput.value = '';
    amountInput.value = '';
}

addEntryBtn.addEventListener('click', addEntry);
resetBtn.addEventListener('click', resetInputs);
filterRadios.forEach(radio => radio.addEventListener('change', renderEntries));

// Initialize the app
renderEntries();
