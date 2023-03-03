from flask import Flask, request, send_from_directory
import json
import os
from dotenv import load_dotenv
import openai
import re
import base64
import time

app = Flask(__name__)

with open("./concretenessRankings.json") as file:
    CONCRETENESS_RANKINGS = json.load(file)

load_dotenv()

CWD = os.getcwd()

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/', methods=['GET'])
def index():
    return "working"

@app.route('/client/pictures/<filename>', methods=['GET'])
def get_picture(filename):
    return send_from_directory(os.path.join(CWD, '../pictures'), filename, mimetype='image/png')

@app.route('/keywords', methods=['POST'])
def get_keywords():
    req_json = request.get_json()
    poem = req_json["poem"]
    num_keywords = req_json["num_keywords"]
    evaluate_concreteness = req_json["evaluate_concreteness"] if "evaluate_concreteness" in req_json else False
    print(f"Generating {num_keywords} keywords for: {poem}")
    keywords = getGPT3Keywords(poem, num_keywords, evaluate_concreteness)
    return {"keywords": keywords}

@app.route('/emotions', methods=['POST'])
def get_emotions():
    req_json = request.get_json()
    poem = req_json["poem"]
    num_emotions = req_json["num_emotions"]
    print(f"Generating {num_emotions} emotions for: {poem}")
    emotions = getGPT3Emotions(poem, num_emotions)
    return {"emotions": emotions }

@app.route('/image-gen', methods=['POST'])
def generate_image():
    req_json = request.get_json()
    prompt = req_json["prompt"]
    print(f'Generating image for: {prompt}')
    image = base64.b64decode(getDALLEImage(prompt))
    filename = prompt + "-" + str(time.time_ns()) + ".png";
    filepath = os.path.join(CWD, '../pictures', filename)

    with open(filepath, "wb") as fh:
        fh.write(image)

    return {"imageURL": filename}

# @app.route('/divide-poem', methods=['POST'])
# def divide_poem():
#     req_json = request.get_json()
#     poem = req_json['poem']
#     stanzas = re.split(r"\n[\n]+", poem)
#     lines = []
#     for stanza in stanzas:
#         lines.append(stanza.split("\n"))
#     new_lines = []
#     for stanza in lines:
#         for line in stanza:
#             words = line.split(" ")
#             words = list(filter(lambda v: v.lower() in CONCRETENESS_RANKINGS and CONCRETENESS_RANKINGS[v.lower()]["Conc.M"] > 2.5, words))
#             new_lines.append(words)
#     return {'lines': new_lines}

# // need to fuss with this later
# app.post('/image-variation', async (req, res) => {
#     try {
#         const path = req.body.pathToVary;
#         console.log(`Generating variation of file: ${path}`);
#         const image = await getDALLEVariation("../../pictures/" + path);

#         const experimentId = req.body.id;
#         const sectionIndex = req.body.sectionIndex;
#         const buffer = Buffer.from(image, "base64");
#         const filename = experimentId + "-" + Date.now() + "-var-" + sectionIndex + ".png";
#         const filepath = "../../pictures/" + experimentId + "/";
#         fs.writeFile(filepath + filename, buffer, (err) => {
#             if (err) res.status(400).send("unable to save image variation");
#         });

#         const imageData = {
#             filledPrompt: '!vary:' + path,
#             imageURL: experimentId + "/" + filename,
#         };

#         const newImages = Object.assign({}, req.body.images);
#         newImages[sectionIndex] = imageData;

#         const experimentData = {
#             id: experimentId,
#             firstPlayerId: req.body.firstPlayerId,
#             secondPlayerId: req.body.secondPlayerId,
#             loggingData: req.body.loggingData,
#             images: newImages,
#         };

#         fs.writeFile(filepath + experimentId + '.json', JSON.stringify(experimentData), (err) => {
#             if (err) res.status(400).send("unable to save experiment data to file");
#         });

#         res.status(200).json(imageData);
#     } catch (err) {
#         console.log("Error in image-variation:");
#         console.log(err);
#         res.status(400).json({error: "could not get variation image"});
#     }
# });

def getDALLEImage(prompt): 
    response = openai.Image.create(
        prompt=textSoaper(prompt),
        n=1,
        size="1024x1024",
        response_format="b64_json"
    )
    b64_json = response["data"][0]["b64_json"]
    return b64_json

# async function getDALLEVariation(path) {
#     const response = await openai.createImageVariation(
#         fs.createReadStream(path),
#         1,
#         "1024x1024",
#         "b64_json",
#     );
#     const b64_json = response.data.data[0].b64_json;
#     return b64_json;
# } we'll do variations when we get there

def getGPT3Keywords(poem, num_keywords, evaluate_concreteness):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Give me {num_keywords} keywords for: {poem}",
        temperature=0,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )
    text = response["choices"][0]["text"]
    words = getWordsFromResponse(text)
    # if evaluate_concreteness:
    #     words = list(filter(lambda v: v.lower() in CONCRETENESS_RANKINGS and CONCRETENESS_RANKINGS[v.lower()]["Conc.M"] >= 2.5, words))
    return words

def getGPT3Emotions(poem, num_emotions):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Give me {num_emotions} emotions for: {poem}",
        temperature=0,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )
    text = response["choices"][0]["text"]
    return getWordsFromResponse(text)

# text soaper
CONJUNCTIONS = ["and", "plus"]

def textSoaper(text):
    new_text = text
    for conj in CONJUNCTIONS:
        new_text = new_text.replace(conj, "")
    new_text = re.sub(r'[.,?!\";:-]', " ", new_text)
    return re.sub(r'\s\s+', " ", new_text)

# other helper functions
def getWordsFromResponse(text): 
    if len(re.findall(r'\d+', text)):
        return list(map(lambda v: v.split(" ")[1], filter(lambda v: len(v), text.split("\n"))))
    return text.split("\n")[1].split(", ")


if __name__ == "__main__":
    app.run(debug=True)