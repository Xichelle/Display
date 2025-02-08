let video;
let faceMesh;
let faces = [];
let options = { maxFaces: 5, refineLandmarks: false, flipHorizontal: false };

function setup() {
    createCanvas(640, 480);

    // Create video capture
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    console.log("Initializing Face Mesh...");

    // ✅ Pass options to enable multi-face detection
    faceMesh = ml5.faceMesh(video, options, modelLoaded);
}

function modelLoaded() {
    console.log("✅ Face Mesh Model Loaded");
}

function draw() {
    background(0);
    image(video, 0, 0, width, height); // Display video

    if (faceMesh) {
        faceMesh.detect(video, gotFaces); // ✅ Run detection in each frame
    }

    // Draw a square around each detected face
    for (let i = 0; i < faces.length; i++) {
        let face = faces[i];

        if (face.boundingBox) {
            let { x, y, width, height } = face.boundingBox;
            noFill();
            stroke(0, 255, 0);
            strokeWeight(2);
            rect(x, y, width, height);
        }
    }

    // Display the face count
    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Faces detected: ${faces.length}`, 10, 10);
}

function gotFaces(results) {
    faces = results; // ✅ Store all detected faces
    console.log(`✅ Faces detected: ${faces.length}`);
}
