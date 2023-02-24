const express = require("express");
const fs = require('fs');
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const { dir } = require("console");
const bodyParser = require('body-parser');

require('dotenv').config();

// Initialize the express engine
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// Take a port 5000 for running server.
const PORT = 4000;

app.get('/',(req,res) => {
    res.status(200).json({
        'message': 'Running Node with Express and Typescript'
    });
});

app.use('/client', express.static(path.join(__dirname, '../../dist/')));
app.use('/client/assets', express.static(path.join(__dirname, '../../assets/')));
app.use('/client/data', express.static(path.join(__dirname, '../../data/')));

app.post('/image-gen', async (req,res) => {
    try {
        const prompt = req.body.prompt;
        console.log(`Generating prompt: ${prompt}`);
        const image = await getDALLEImage(prompt);
        const buffer = Buffer.from(image, "base64");
        // Using datetime to ensure that no two images have the same name if you redo an image.
        const filename = prompt + "-" + Date.now() + ".png";
        const filepath = "../../data/";
        fs.writeFile(filepath + filename, buffer, (err) => {
            // In case of a error throw err.
            if (err) res.status(400).send("unable to save image");
        });

        res.status(200).json(
            imageData
        );
    }
    catch (err) {
        console.log("Error in image-gen:");
        console.log(err);
        res.status(400).json(
            {error: "could not get image"}
        );
    }
});

// need to fuss with this later
app.post('/image-variation', async (req, res) => {
    try {
        const path = req.body.pathToVary;
        console.log(`Generating variation of file: ${path}`);
        const image = await getDALLEVariation("../../data/" + path);

        const experimentId = req.body.id;
        const sectionIndex = req.body.sectionIndex;
        const buffer = Buffer.from(image, "base64");
        const filename = experimentId + "-" + Date.now() + "-var-" + sectionIndex + ".png";
        const filepath = "../../data/" + experimentId + "/";
        fs.writeFile(filepath + filename, buffer, (err) => {
            if (err) res.status(400).send("unable to save image variation");
        });

        const imageData = {
            filledPrompt: '!vary:' + path,
            imageURL: experimentId + "/" + filename,
        };

        const newImages = Object.assign({}, req.body.images);
        newImages[sectionIndex] = imageData;

        const experimentData = {
            id: experimentId,
            firstPlayerId: req.body.firstPlayerId,
            secondPlayerId: req.body.secondPlayerId,
            loggingData: req.body.loggingData,
            images: newImages,
        };

        fs.writeFile(filepath + experimentId + '.json', JSON.stringify(experimentData), (err) => {
            if (err) res.status(400).send("unable to save experiment data to file");
        });

        res.status(200).json(imageData);
    } catch (err) {
        console.log("Error in image-variation:");
        console.log(err);
        res.status(400).json({error: "could not get variation image"});
    }
});

app.listen(PORT, () => {
    console.log(
        `Server running on ${PORT}.`
    );
});

// extra functions that (sadly) have to be stored here because express doesn't work well with typescript 

// openai function
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function getDALLEImage(prompt) {
	const response = await openai.createImage({
        prompt: textSoaper(prompt),
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
    });
    const b64_json = response.data.data[0].b64_json;
    return b64_json;
}

async function getDALLEVariation(path) {
    const response = await openai.createImageVariation(
        fs.createReadStream(path),
        1,
        "1024x1024",
        "b64_json",
    );
    const b64_json = response.data.data[0].b64_json;
    return b64_json;
}

// text soaper
const CONJUNCTIONS = ["and", "plus"];

function textSoaper(text) {
    let new_text = text;
    for (let i = 0; i < CONJUNCTIONS.length; i ++) {
        new_text = new_text.replace(CONJUNCTIONS[i], "");
    }
    return new_text.replace(/[.,?!\";:-]/, " ").replace(/\s\s+/, " ");
}