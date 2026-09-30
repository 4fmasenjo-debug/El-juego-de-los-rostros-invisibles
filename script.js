console.log("=================================");
console.log("INICIANDO SCRIPT");
console.log("=================================");

console.log("URL:", window.location.href);

if (typeof faceapi === "undefined") {

    console.error("FACE-API NO ESTÁ CARGADO");

} else {

    console.log("FACE-API CARGADO CORRECTAMENTE");

    const video = document.getElementById("video");
    const overlay = document.getElementById("overlay-elements");

    cargarModelo();


    async function cargarModelo() {

        try {

            console.log("Cargando Tiny Face Detector...");

            await faceapi.nets.tinyFaceDetector.loadFromUri("./models");

            console.log("Tiny Face Detector cargado");

            iniciarWebcam();

        } catch (error) {

            console.error("Error cargando modelo:");
            console.error(error);

        }

    }


    async function iniciarWebcam() {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });

            video.srcObject = stream;

            console.log("Webcam iniciada");

        } catch (error) {

            console.error("Error con la webcam:");
            console.error(error);

        }

    }

}
