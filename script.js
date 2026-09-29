const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
]).then(() => {
    console.log("Modelos cargados correctamente.");
    video.play().catch(err => console.log("Reproducción automática bloqueada, requiere interacción:", err));
});
let imagesAdded = false;
let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;
video.addEventListener("play", () => {
    const displaySize = { width: video.width, height: video.height };
    const canvas = faceapi.createCanvasFromMedia(video);
    overlay.appendChild(canvas);
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        if (resizedDetections.length >= 4) {
            if (!imagesAdded) {
                console.log("¡Cuatro o más personas detectadas! Añadiendo imágenes.");
                
                grullasImage = document.createElement("img");
                grullasImage.src = "grullas.png";
                grullasImage.style.position = "absolute";
                grullasImage.style.zIndex = "10";
                grullasImage.style.pointerEvents = "none";
                overlay.appendChild(grullasImage);

                libelulaImage = document.createElement("img");
                libelulaImage.src = "libelula.png";
                libelulaImage.style.position = "absolute";
                libelulaImage.style.zIndex = "10";
                libelulaImage.style.pointerEvents = "none";
                overlay.appendChild(libelulaImage);
                
                mariposasImage = document.createElement("img");
                mariposasImage.src = "mariposas.png";
                mariposasImage.style.position = "absolute";
                mariposasImage.style.zIndex = "10";
                mariposasImage.style.pointerEvents = "none";
                overlay.appendChild(mariposasImage);

                pezImage = document.createElement("img");
                pezImage.src = "pez.png";
                pezImage.style.position = "absolute";
                pezImage.style.zIndex = "10";
                pezImage.style.pointerEvents = "none";
                overlay.appendChild(pezImage);

                imagesAdded = true;
            }

            grullasImage.style.display = "block";
            grullasImage.style.left = `${resizedDetections[0].box.x}px`;
            grullasImage.style.top = `${resizedDetections[0].box.y}px`;
            grullasImage.style.width = `${resizedDetections[0].box.width}px`;
            grullasImage.style.height = `${resizedDetections[0].box.height}px`;

            libelulaImage.style.display = "block";
            libelulaImage.style.left = `${resizedDetections[1].box.x}px`;
            libelulaImage.style.top = `${resizedDetections[1].box.y}px`;
            libelulaImage.style.width = `${resizedDetections[1].box.width}px`;
            libelulaImage.style.height = `${resizedDetections[1].box.height}px`;
            
            mariposasImage.style.display = "block";
            mariposasImage.style.left = `${resizedDetections[2].box.x}px`;
            mariposasImage.style.top = `${resizedDetections[2].box.y}px`;
            mariposasImage.style.width = `${resizedDetections[2].box.width}px`;
            mariposasImage.style.height = `${resizedDetections[2].box.height}px`;
            
            pezImage.style.display = "block";
            pezImage.style.left = `${resizedDetections[3].box.x}px`;
            pezImage.style.top = `${resizedDetections[3].box.y}px`;
            pezImage.style.width = `${resizedDetections[3].box.width}px`;
            pezImage.style.height = `${resizedDetections[3].box.height}px`;

        } else {
            if (grullasImage) grullasImage.style.display = "none";
            if (libelulaImage) libelulaImage.style.display = "none";
            if (mariposasImage) mariposasImage.style.display = "none"; 
            if (pezImage) pezImage.style.display = "none";
            imagesAdded = false;
        }
    }, 100);
});