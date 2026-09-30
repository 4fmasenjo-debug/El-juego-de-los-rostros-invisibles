console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");


const video = document.getElementById("video");

const overlay = document.getElementById(
    "overlay-elements"
);



let imagesAdded = false;


let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;



// ============================================================
// CARGAR MODELO
// ============================================================


Promise.all([

    faceapi.nets.tinyFaceDetector.loadFromUri(
        "./models"
    )

])


.then(()=>{


    console.log(
        "MODELOS CARGADOS CORRECTAMENTE."
    );


    video.play()
    .then(()=>{

        console.log(
            "VIDEO REPRODUCIENDOSE."
        );

    })

    .catch(error=>{

        console.error(
            "ERROR VIDEO:",
            error
        );

    });


})

.catch(error=>{


    console.error(
        "ERROR CARGANDO MODELO:",
        error
    );


});





// ============================================================
// DETECCION
// ============================================================


video.addEventListener(
"play",
()=>{


console.log(
    "INICIANDO DETECCION FACIAL."
);



const displaySize = {

    width:720,
    height:560

};



const canvas = faceapi.createCanvasFromMedia(
    video
);



overlay.appendChild(
    canvas
);



faceapi.matchDimensions(
    canvas,
    displaySize
);





setInterval(async()=>{


const detections = await faceapi.detectAllFaces(

    video,

    new faceapi.TinyFaceDetectorOptions({

        inputSize:128,

        scoreThreshold:0.3

    })

);



const resizedDetections =
faceapi.resizeResults(

    detections,

    displaySize

);



console.log(
    "CARAS DETECTADAS:",
    resizedDetections.length
);





// ============================================================
// CUATRO PERSONAS
// ============================================================


if(resizedDetections.length >= 4){



    if(!imagesAdded){


        console.log(
            "AÑADIENDO IMAGENES."
        );



        grullasImage =
        crearImagen(
            "./grullas.png"
        );



        libelulaImage =
        crearImagen(
            "./libelula.png"
        );



        mariposasImage =
        crearImagen(
            "./mariposas.png"
        );



        pezImage =
        crearImagen(
            "./pez.png"
        );



        imagesAdded=true;


    }




    colocarImagen(

        grullasImage,

        resizedDetections[0].box

    );



    colocarImagen(

        libelulaImage,

        resizedDetections[1].box

    );



    colocarImagen(

        mariposasImage,

        resizedDetections[2].box

    );



    colocarImagen(

        pezImage,

        resizedDetections[3].box

    );



}

else{


ocultarImagenes();


}



},200);



});






// ============================================================
// CREAR IMAGEN
// ============================================================


function crearImagen(src){


let img =
document.createElement("img");



img.src=src;


img.style.position="absolute";


img.style.zIndex="10";


img.style.display="none";


overlay.appendChild(img);



return img;


}






// ============================================================
// COLOCAR IMAGEN SOBRE CARA
// ============================================================


function colocarImagen(img,box){


img.style.display="block";


img.style.left =
box.x+"px";


img.style.top =
box.y+"px";


img.style.width =
box.width+"px";


img.style.height =
box.height+"px";


}






// ============================================================
// OCULTAR
// ============================================================


function ocultarImagenes(){


if(grullasImage)
grullasImage.style.display="none";


if(libelulaImage)
libelulaImage.style.display="none";


if(mariposasImage)
mariposasImage.style.display="none";


if(pezImage)
pezImage.style.display="none";


imagesAdded=false;


}
