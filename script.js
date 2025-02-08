let img;
let images = ["image1.png", "image2.jpg", "image3.jpg", "image4.jpg"]; // Local images
let currentImageIndex = 0;
let faceMesh;
let video;
let faces = []; // Store detected faces
let lastImageChangeTime = 0;

let options = { maxFaces: 5, refineLandmarks: false, flipHorizontal: false };

// ✅ Load Face Mesh in `preload()`
function preload() {
    faceMesh = ml5.faceMesh(options);
}

// ✅ Load Next Image
function loadNextImage() {
    img = loadImage(images[currentImageIndex], () => {
        console.log("✅ Image loaded:", images[currentImageIndex]);
    }, () => {
        console.error("❌ Failed to load image:", images[currentImageIndex]);
    });

    currentImageIndex = (currentImageIndex + 1) % images.length;
}

// ✅ Setup p5.js Canvas and Video Feed
function setup() {
    createCanvas(640, 480);

    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    console.log("ℹ️ Initializing Face Mesh...");

    // ✅ Load Face Mesh Model and Start Detecting Faces in `draw()`
    faceMesh = ml5.faceMesh(video, () => {
        console.log("✅ Face Mesh Model Loaded");
    });

    loadNextImage(); // Load the first image
}

// ✅ Draw Loop (Face Detection & Image Change)
function draw() {
    background(220);

    // ✅ Run Face Mesh Detection in `draw()`
    faceMesh.detect(video, gotFaces);


    if (img) {
        drawBlurredImage(img, faces.length);
    } else {
        textSize(20);
        fill(50);
        textAlign(CENTER, CENTER);
        text("Loading images...", width / 2, height / 2);
    }

    // ✅ Change Image Only If No Faces Detected for 60 Seconds
    if (faces.length === 0 && millis() - lastImageChangeTime > 60000) {
        loadNextImage();
        lastImageChangeTime = millis();
    }
}

// ✅ Process Face Mesh Detection Results
function gotFaces(results) {
    faces = results; // Update detected faces
    console.log("✅ Faces detected:", faces.length);
}

// ✅ Apply Blur Effect Based on Face Count (No More Wave Effect)
function drawBlurredImage(img, faceCount) {
    let maxBlur = 10;
    let blurLevel = map(faceCount, 0, 3, maxBlur, 0);
    blurLevel = constrain(blurLevel, 0, maxBlur);

    drawingContext.filter = `blur(${blurLevel}px)`;
    image(img, 0, 0, width, height);
    drawingContext.filter = "none"; // Reset filter
}
