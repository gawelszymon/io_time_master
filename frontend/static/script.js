// script.js

async function login() {
    // Pobieranie wartości ID, hasła i stanowiska
    const id = document.getElementById("id").value.trim();
    const password = document.getElementById("password").value.trim();
    const position = document.getElementById("position").value;

    // Sprawdzanie, czy pola są wypełnione
    if (id === "" || password === "") {
        alert("Proszę wypełnić pola ID i hasło.");
        return;
    }

    // Sprawdzanie, czy stanowisko zostało wybrane
    if (position === "Wybierz stanowisko" || !position) {
        alert("Proszę wybrać stanowisko pracy.");
        return;
    }

    // Sprawdzanie, czy zalogowano jako admin czy pracownik
    if (id === "admin" && password === "admin123") {
        // Przechowaj ID użytkownika w localStorage
        localStorage.setItem("userId", id);
        // Przekierowanie do panelu administratora
        window.location.href = "admin.html";
    } else if (id === "user" && password === "user123") { // Przykładowy pracownik
        // Przechowaj ID użytkownika i stanowisko w localStorage
        localStorage.setItem("userId", id);
        localStorage.setItem("position", position);

        // Wykonaj zdjęcie przy logowaniu
        await captureLoginPhoto();

        // Przekierowanie do panelu pracownika
        window.location.href = "user.html";
    } else {
        // Komunikat o błędzie przy niepoprawnych danych logowania
        alert("Nieprawidłowe ID lub hasło. Spróbuj ponownie.");
    }
}

// Funkcja wykonująca zdjęcie przy logowaniu
async function captureLoginPhoto() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Twoja przeglądarka nie obsługuje funkcji kamery.");
        return;
    }

    try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.createElement('video');
        videoElement.srcObject = cameraStream;

        // Poczekaj, aż strumień wideo zostanie załadowany
        await new Promise(resolve => videoElement.onloadedmetadata = resolve);

        // Ustaw wymiary canvas
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const context = canvas.getContext("2d");

        // Narysuj klatkę z wideo na canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png"); // Obraz jako data URL

        // Zatrzymaj strumień kamery
        cameraStream.getTracks().forEach(track => track.stop());

        // Wysyłanie zdjęcia do serwera
        const userId = localStorage.getItem("userId");
        const position = localStorage.getItem("position");

        await fetch('/api/saveLoginPhoto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                position,
                imageData,
                timestamp: new Date().toISOString()
            })
        });

    } catch (error) {
        console.error("Błąd podczas wykonywania zdjęcia przy logowaniu:", error);
        alert("Nie można wykonać zdjęcia przy logowaniu.");
    }
}
