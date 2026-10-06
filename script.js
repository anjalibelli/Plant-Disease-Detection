const imageInput = document.getElementById("imageInput");
const chooseBtn = document.getElementById("chooseBtn");
const preview = document.getElementById("preview");
const detectBtn = document.getElementById("detectBtn");
const result = document.getElementById("result");

let model = null;


// 1. Load the AI model
async function loadModel() {

    try {

        result.innerHTML = `
            <div class="result-icon">⏳</div>
            <p>Loading AI model...</p>
        `;

        const modelURL = "./model.json";
        const metadataURL = "./metadata.json";

        model = await tmImage.load(modelURL, metadataURL);

        result.innerHTML = `
            <div class="result-icon">✅</div>
            <p>AI model loaded successfully!</p>
            <p>Upload a leaf image.</p>
        `;

        console.log("AI model loaded!");

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <div class="result-icon">❌</div>
            <p>Model could not be loaded.</p>
        `;
    }
}


// 2. Open file picker
chooseBtn.addEventListener("click", function () {

    imageInput.click();

});


// 3. When user selects an image
imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (file) {

        const imageURL = URL.createObjectURL(file);

        preview.src = imageURL;
        preview.style.display = "block";

        result.innerHTML = `
            <div class="result-icon">🌿</div>
            <p>Image uploaded successfully.</p>
            <p>Click Detect Disease.</p>
        `;
    }

});


// 4. Detect disease
detectBtn.addEventListener("click", async function () {

    if (!imageInput.files.length) {

        result.innerHTML = `
            <div class="result-icon">⚠️</div>
            <p>Please upload a leaf image first.</p>
        `;

        return;
    }


    if (!model) {

        result.innerHTML = `
            <div class="result-icon">⏳</div>
            <p>AI model is still loading.</p>
        `;

        return;
    }


    result.innerHTML = `
        <div class="result-icon">🔍</div>
        <p>Analyzing image...</p>
    `;


    try {

        const predictions = await model.predict(preview);

        console.log(predictions);


        // Find highest prediction
        let bestPrediction = predictions[0];

        for (let i = 1; i < predictions.length; i++) {

            if (
                predictions[i].probability >
                bestPrediction.probability
            ) {

                bestPrediction = predictions[i];

            }
        }


        const disease = bestPrediction.className;

        const confidence =
            (bestPrediction.probability * 100).toFixed(2);


        result.innerHTML = `
            <div class="result-icon">🌿</div>

            <h3>${disease}</h3>

            <p>
                Confidence: ${confidence}%
            </p>
        `;


    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <div class="result-icon">❌</div>
            <p>Could not analyze the image.</p>
        `;
    }

});


// 5. Start the model
loadModel();
