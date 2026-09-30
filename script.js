```js
console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;

let modeloCargado = false;
let detectando = false;


// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {
    throw new Error("faceapi no está disponible.");
}

console.log("face-api.js cargado correctamente.");


// ============================================================
// CREAR IMÁGENES
// ============================================================

function crearImagen(ruta) {

    const img = document.createElement("img");

    img.src = ruta;

    img.style.position = "absolute";
    img.style.zIndex = "10";
    img.style.pointerEvents = "none";
    img.style.display = "none";

    overlay.appendChild(img);

    return img;
}


// ============================================================
// CARGAR IMÁGENES
// ============================================================

function cargarImagenes() {

    grullasImage = crearImagen("./grullas.png");
    libelulaImage = crearImagen("./libelula.png");
    mariposasImage = crearImagen("./mariposas.png");
    pezImage = crearImagen("./pez.png");

    console.log("Imágenes cargadas.");
}


// ============================================================
// CARGAR MODELO
// ============================================================

async function cargarModelo() {

    try {

        console.log("Cargando Tiny Face Detector...");

        await faceapi.nets.tinyFaceDetector.loadFromUri("./models");

        modeloCargado = true;

        console.log("Modelo cargado correctamente.");

        cargarImagenes();

        prepararVideo();

    } catch (error) {

        console.error("Error cargando el modelo:", error);

    }
}


// ============================================================
// PREPARAR VÍDEO
// ============================================================

function prepararVideo() {

    if (!video) {

        console.error("No existe el elemento video.");

        return;

    }

    video.addEventListener("loadeddata", () => {

        iniciarVideo();

    }, { once: true });


    video.addEventListener("error", () => {

        console.error("Error cargando el vídeo.");

    });


    if (video.readyState >= 2) {

        iniciarVideo();

    }

}


// ============================================================
// REPRODUCIR VÍDEO
// ============================================================

async function iniciarVideo() {

    try {

        await video.play();

        console.log("Vídeo reproduciéndose.");

        iniciarDeteccion();

    } catch (error) {

        console.error("No se pudo reproducir el vídeo:", error);

    }

}


// ============================================================
// INICIAR DETECCIÓN
// ============================================================

function iniciarDeteccion() {

    if (!modeloCargado || detectando) {

        return;

    }

    detectando = true;

    detectar();

}


// ============================================================
// DETECCIÓN
// ============================================================

async function detectar() {

    while (!video.paused && !video.ended) {

        try {

            const ancho = video.clientWidth;
            const alto = video.clientHeight;

            const detecciones = await faceapi.detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: 160,
                    scoreThreshold: 0.5
                })
            );

            const resultados = faceapi.resizeResults(
                detecciones,
                {
                    width: ancho,
                    height: alto
                }
            );


            if (resultados.length >= 4) {

                colocarImagen(
                    grullasImage,
                    resultados[0].box
                );

                colocarImagen(
                    libelulaImage,
                    resultados[1].box
                );

                colocarImagen(
                    mariposasImage,
                    resultados[2].box
                );

                colocarImagen(
                    pezImage,
                    resultados[3].box
                );

            } else {

                ocultarImagenes();

            }

        } catch (error) {

            console.error(
                "Error en la detección:",
                error
            );

        }


        // ----------------------------------------------------
        // 200 ms = aproximadamente 5 detecciones por segundo
        // ----------------------------------------------------

        await esperar(200);

    }

    detectando = false;

}


// ============================================================
// COLOCAR IMAGEN
// ============================================================

function colocarImagen(img, box) {

    if (!img) {
        return;
    }

    img.style.display = "block";

    img.style.left = `${box.x}px`;
    img.style.top = `${box.y}px`;

    img.style.width = `${box.width}px`;
    img.style.height = `${box.height}px`;

}


// ============================================================
// OCULTAR IMÁGENES
// ============================================================

function ocultarImagenes() {

    if (grullasImage) {
        grullasImage.style.display = "none";
    }

    if (libelulaImage) {
        libelulaImage.style.display = "none";
    }

    if (mariposasImage) {
        mariposasImage.style.display = "none";
    }

    if (pezImage) {
        pezImage.style.display = "none";
    }

}


// ============================================================
// ESPERAR
// ============================================================

function esperar(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}


// ============================================================
// INICIAR
// ============================================================

cargarModelo();
```


