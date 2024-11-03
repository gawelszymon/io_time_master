// users.js


async function usersTable() {
    try {
        const response = await fetch('/users_table');
        const data = await response.json();
        console.log(data);

        const tableBody = document.getElementById('usersTableBody');
        tableBody.innerHTML = '';

        data.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.position}</td>
                <td>${user.action}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.log(error);
        alert('nie można załadować danych do tabeli');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    usersTable();
});

window.goBack = function() {
    window.location.href = 'admin';
}
