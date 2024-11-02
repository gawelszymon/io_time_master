// admin.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    window.addEmployee = async function(e) {
        e.preventDefault();

        const adminId = document.getElementById('admin-id').value;
        const password = document.getElementById('admin-password').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    admin_id: adminId,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Pracownik zarejestrowany');
                form.reset();
            } else {
                alert(`Błąd: ${data.error}`);
            }
        } catch (error) {
            console.error('Błąd:', error);
            alert('Błąd podczas rejestracji');
        }
    };
});

function deleteEmployee() {
    const id = document.getElementById("admin-id").value.trim();

    if (id === "") {
        alert("Proszę wprowadzić ID pracownika do usunięcia.");
        return;
    }

    // Przykład wysyłania danych do serwera
    fetch('/api/deleteEmployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(response => {
        if (response.ok) {
            alert("Pracownik został usunięty.");
        } else {
            alert("Wystąpił błąd podczas usuwania pracownika.");
        }
    })
    .catch(error => {
        console.error("Błąd:", error);
        alert("Wystąpił błąd podczas usuwania pracownika.");
    });
}

function generateReport() {
    fetch('/api/generateReport')
        .then(response => response.blob())
        .then(blob => {
            // Tworzenie linku do pobrania
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'raport.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            console.error("Błąd podczas generowania raportu:", error);
            alert("Wystąpił błąd podczas generowania raportu.");
        });
}

function viewUsers() {
    // Przekierowanie do strony z listą użytkowników
    window.location.href = 'users.html';
}
