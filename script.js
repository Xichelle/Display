let img;
let images = ["image1.png", "image2.jpg", "image3.jpg", "image4.jpg"];
let currentImageIndex = 0;
let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 3, refineLandmarks: false, flipHorizontal: false };
let lastImageChangeTime = 0;
// let blurAmount = 50;
let imageOpacity = 0;// Start fully transparent

function preload() {
    gif = loadImage("tv_static.gif"); // ✅ Load the GIF (Replace with your GIF file)
}

function setup() {
    createCanvas(windowWidth, windowHeight+100);

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
    // blurAmount = map(faces.length, 0, 3, 50, 0);
    // blurAmount = constrain(blurAmount, 0, 50);
    // gifOpacity = map(faces.length, 0, 3, 255, 0);
    // gifOpacity = constrain(gifOpacity, 0, 255); // Min 50 (semi-transparent), max 255 (fully visible)
    imageOpacity = map(faces.length, 0, 3, 0, 255);
    imageOpacity = constrain(imageOpacity, 0, 255); // Min 0 (invisible), max 255 (fully visible)


    detectFaces(); // Keep detecting in a loop
}

// ✅ Draw Loop
function draw() {
    background(0);

    // ✅ Draw the TV Static GIF as the background
    image(gif, 0, 0, width, height); // Cover the entire screen

    // ✅ Apply transparency to the meme image
    if (img) {
        tint(255, imageOpacity); // Adjust transparency
        image(img, 0, 0, width, height); // Overlay the meme image
        tint(255, 255); // Reset tint for other elements
    }

    // if (img) {
    //     applyEffects(img, faces.length);
    // } else {
    //     textSize(20);
    //     fill(255);
    //     textAlign(CENTER, CENTER);
    //     text("Loading images...", width / 2, height / 2);
    // }



    // ✅ If no faces detected for 60 seconds, change image
    if (faces.length === 0 && millis() - lastImageChangeTime > 60000) {
        loadNextImage();
        lastImageChangeTime = millis();
    }
    drawCircles(faces.length);
}

// ✅ Apply Blur Effect to Image
// function applyEffects(img, faceCount) {
//     drawingContext.filter = `blur(${blurAmount}px)`;
//     image(img, 0, 0, width, height);
//     drawingContext.filter = "none";
// }

// ✅ Draw Circles Based on Face Count
function drawCircles(faceCount) {
    let circleColors = ["#f4f4f400", "#f4f4f400", "#f4f4f400"];

    if (faceCount >= 1) circleColors[0] = "white";
    if (faceCount >= 2) circleColors[1] = "white";
    if (faceCount >= 3) circleColors[2] = "white";

    let startX = 180; // Center circles horizontally
    let yPosition = 160;

    for (let i = 0; i < 3; i++) {
        fill(circleColors[i]);
        stroke(255);
        strokeWeight(5)
        ellipse(startX + i * 100, yPosition, 40, 40);
    }
}



    

