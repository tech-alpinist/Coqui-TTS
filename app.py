#!/usr/bin/env python3

from flask import Flask, request, render_template, jsonify, send_file
from flask_cors import CORS
import json
import io

app = Flask(__name__)
CORS(app)

#### TTS model import 
from TTS.utils.manage import ModelManager
from TTS.utils.synthesizer import Synthesizer

# Load the checkpoint of your custom model
model_checkpoint_path = "CoquiFemaleModel/checkpoint_2530000.pth"
model_config_path = "CoquiFemaleModel/config.json"

syn = Synthesizer(
    tts_checkpoint=model_checkpoint_path,
    tts_config_path=model_config_path,
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/synthesize_text', methods=['POST'])
def synthesize():
    request_json = request.get_json()
    data = json.loads(request_json)

    ##### Synthesize with Coqui Model #####
    outputs = syn.tts(data['text'])
    out = io.BytesIO()
    syn.save_wav(outputs, out)
    #######################################

    return send_file(out, mimetype="audio/wav")

if __name__ == "__main__":
  app.run(debug=True, port=8080)