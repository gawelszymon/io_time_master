// user.js

// Pobierz ID użytkownika i stanowisko z localStorage
const userId = localStorage.getItem("userId");
const position = localStorage.getItem("position");

// Obsługa kamery
let cameraStream = null;

async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Twoja przeglądarka nie obsługuje funkcji kamery.");
        return;
    }

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById('camera');
        videoElement.srcObject = cameraStream;
    } catch (error) {
        console.error("Błąd dostępu do kamery:", error);
        alert("Nie można uzyskać dostępu do kamery. Sprawdź uprawnienia.");
    }
}

window.addEventListener('load', startCamera);

// Zmienne do licznika czasu
let timerInterval;
let elapsedTime = 0;
let isRunning = false;
let startTime;
let endTime;

// Funkcja rozpoczynająca lub kontynuująca odliczanie czasu
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        if (!startTime) {
            // Zapisanie godziny rozpoczęcia, jeśli to pierwszy start
            startTime = new Date();
            document.getElementById("startTimeDisplay").innerText = 
                "Godzina rozpoczęcia: " + formatTime(startTime);
        }
        const startTimestamp = Date.now() - elapsedTime;
        timerInterval = setInterval(() => updateTimer(startTimestamp), 1000);
    }
}

// Funkcja zatrzymująca licznik (pauza)
function stopTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
    }
}

// Funkcja kończąca odliczanie
function endTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    isRunning = false;
    endTime = new Date();
    document.getElementById("endTimeDisplay").innerText = 
        "Godzina zakończenia: " + formatTime(endTime);
}

// Funkcja resetująca licznik i czyszcząca dane czasu
function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    isRunning = false;
    startTime = null;
    endTime = null;
    document.getElementById("timer").innerText = "00:00:00";
    document.getElementById("startTimeDisplay").innerText = "Godzina rozpoczęcia: --:--:--";
    document.getElementById("endTimeDisplay").innerText = "Godzina zakończenia: --:--:--";
}

// Funkcja aktualizująca licznik czasu
function updateTimer(startTimestamp) {
    const now = Date.now();
    elapsedTime = now - startTimestamp;

    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    document.getElementById("timer").innerText = 
        String(hours).padStart(2, '0') + ":" +
        String(minutes).padStart(2, '0') + ":" +
        String(seconds).padStart(2, '0');
}

// Funkcja formatująca datę na HH:MM:SS
function formatTime(date) {
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Funkcja wysyłająca czas i zdjęcie do bazy danych
async function sendData() {
    // Sprawdzenie warunków do wysłania danych
    if (elapsedTime === 0) {
        alert("Czas pracy wynosi 0. Nie można wysłać danych.");
        return;
    }

    if (!startTime || !endTime) {
        alert("Brak godziny rozpoczęcia lub zakończenia pracy. Upewnij się, że wprowadziłeś obie godziny.");
        return;
    }

    if (!cameraStream) {
        alert("Brak dostępu do kamery. Sprawdź uprawnienia i spróbuj ponownie.");
        return;
    }

    // Pobranie obrazu z kamery (zdjęcie wylogowania)
    const video = document.getElementById("camera");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const logoutImageData = canvas.toDataURL("image/png"); // Obraz jako data URL

    // Wysyłanie danych do serwera
    try {
        const response = await fetch('/api/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                position,
                elapsedTime,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                logoutImageData
            })
        });

        if (response.ok) {
            alert("Dane zostały pomyślnie wysłane.");
            resetTimer();
            // Opcjonalnie: Przekierowanie do strony logowania
            window.location.href = "index.html";
        } else {
            alert("Wystąpił błąd podczas wysyłania danych.");
        }
    } catch (error) {
        console.error("Błąd podczas wysyłania danych:", error);
        alert("Wystąpił błąd podczas wysyłania danych.");
    }
}
