let img;
let images = ["image1.png", "image2.jpg", "image3.jpg", "image4.jpg"];
let currentImageIndex = 0;
let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 3, refineLandmarks: false, flipHorizontal: false };
let lastImageChangeTime = 0;
let blurAmount = 10;

function setup() {
    createCanvas(640, 480);

    // ✅ Create video capture
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    console.log("Initializing Face Mesh...");

    // ✅ Correctly initialize Face Mesh with options
    faceMesh = ml5.faceMesh(video, options, modelLoaded);

    loadNextImage();
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

// ✅ Face Mesh Model Loaded
function modelLoaded() {
    console.log("✅ Face Mesh Model Loaded");
    detectFaces(); // Start detecting faces
}

// ✅ Continuous Face Detection Loop
function detectFaces() {
    faceMesh.detect(video, gotFaces); // ✅ Fix: Use `video` instead of `img`
}

// ✅ Store Detected Faces and Update Blur
function gotFaces(results) {
    faces = results;
    console.log(`✅ Faces detected: ${faces.length}`);

    // Adjust blur effect based on detected faces
    blurAmount = map(faces.length, 0, 3, 10, 0);
    blurAmount = constrain(blurAmount, 0, 10);

    detectFaces(); // Keep detecting in a loop
}

// ✅ Draw Loop
function draw() {
    background(0);

    if (img) {
        applyEffects(img, faces.length);
    } else {
        textSize(20);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Loading images...", width / 2, height / 2);
    }

    // ✅ If no faces detected for 60 seconds, change image
    if (faces.length === 0 && millis() - lastImageChangeTime > 60000) {
        loadNextImage();
        lastImageChangeTime = millis();
    }
}

// ✅ Apply Blur Effect to Image
function applyEffects(img, faceCount) {
    drawingContext.filter = `blur(${blurAmount}px)`;
    image(img, 0, 0, width, height);
    drawingContext.filter = "none";
}
