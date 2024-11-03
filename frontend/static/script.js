document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    window.login = async function (e) {
        e.preventDefault();

        const id = document.getElementById('id');
        const password = document.getElementById('password');
        const position = document.getElementById('position');

        if (!id.value || !password.value || !position.value) {
            alter('Proszę wypełnić wszystkie pola!');
            return;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id.value,
                    password: password.value,
                    position: position.value
                })
            });

            const data = await response.json();

            if (response.status === 401) {
                alert(`${data.error}`);
            } else if (!response.ok) {
                throw new Error(data.error || "wystąpił błąd podczas logowania");
            } else {
                window.location.href = data.redirect_url;
            }

        } catch (error){
            alert(error.message);
            console.error(error);
        }
    };
});




        
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
