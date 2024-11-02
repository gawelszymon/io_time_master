// users.js

// Upewnienie się, że funkcja goBack jest w globalnym zasięgu
window.goBack = function() {
    window.location.href = 'admin';
}

document.addEventListener('DOMContentLoaded', loadUsers);

function loadUsers() {
    fetch('/api/getUsers')
        .then(response => response.json())
        .then(data => {
            const usersTableBody = document.getElementById('usersTableBody');
            usersTableBody.innerHTML = '';

            data.forEach(user => {
                const tr = document.createElement('tr');

                const tdId = document.createElement('td');
                tdId.textContent = user.id;
                tr.appendChild(tdId);

                const tdPosition = document.createElement('td');
                tdPosition.textContent = user.position || 'Brak danych';
                tr.appendChild(tdPosition);

                const tdActions = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Usuń';
                deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
                deleteButton.onclick = () => deleteUser(user.id);
                tdActions.appendChild(deleteButton);
                tr.appendChild(tdActions);

                usersTableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Błąd podczas pobierania użytkowników:", error);
            alert("Wystąpił błąd podczas pobierania użytkowników.");
        });
}

function deleteUser(id) {
    if (confirm(`Czy na pewno chcesz usunąć użytkownika o ID: ${id}?`)) {
        fetch('/api/deleteEmployee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        .then(response => {
            if (response.ok) {
                alert("Pracownik został usunięty.");
                loadUsers();
            } else {
                alert("Wystąpił błąd podczas usuwania pracownika.");
            }
        })
        .catch(error => {
            console.error("Błąd:", error);
            alert("Wystąpił błąd podczas usuwania pracownika.");
        });
    }
}
