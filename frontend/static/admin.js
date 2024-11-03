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
                window.location.reload();
            } else if (response.status === 409) {
                alert(`${data.error}`);
            } else {
                alert(`Błąd: ${data.error}`);
            }
        } catch (error) {
            console.error('Błąd:', error);
            alert(error);
        }
    };

    window.removeEmployee = async function (e) {
        e.preventDefault();

        const adminId = document.getElementById('admin-id').value;
        const password = document.getElementById('admin-password').value;

        try {
            const response = await fetch('/remove', {
                method: 'DELETE',
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
                alert('Pracownik wyrejestrowany');
                window.location.reload();
            } else {
                alert(`Błąd: ${data.error}`);
            }
        } catch (error) {
            console.error('Błąd:', error);
            alert('Błąd podczas usuwania z listy pracowników');
        }
    };    
});

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
    window.location.href = 'users';
}
