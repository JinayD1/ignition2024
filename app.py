import json
import os

import google.generativeai as genai
from flask import Flask, jsonify, request, send_file, send_from_directory

API_KEY = 'add your api key here'

genai.configure(api_key=API_KEY)

app = Flask(__name__)


@app.route("/")
def index():
    return send_file('web/index.html')


@app.route("/api/generate", methods=["POST"])
def generate_api():
    if request.method == "POST":
        if API_KEY == 'TODO':
            return jsonify({ "error": '''
                To get started, get an API key at
                https://g.co/ai/idxGetGeminiKey and enter it in
                main.py
                '''.replace('\n', '') })
        try:
            req_body = request.get_json()
            content = req_body.get("contents")
            model = genai.GenerativeModel(model_name=req_body.get("model"))
            response = model.generate_content(content, stream=True)
            def stream():
                for chunk in response:
                    yield 'data: %s\n\n' % json.dumps({ "text": chunk.text })

            return stream(), {'Content-Type': 'text/event-stream'}

        except Exception as e:
            return jsonify({ "error": str(e) })


@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('web', path)

def generate_quiz():
    if request.method == "POST":
        reqJson = request.get_json()
        notes = reqJson.get('notes')
        model = genai.GenerativeModel(model_name='chat-bison')
        prompt = f"Create a 5-question multiple-choice quiz based on the following notes:\n\n{notes}"
        try:
            response = model.generate_content(prompt, stream=False)
            quiz = parse_quiz(response)
            return jsonify({'quiz': quiz})
        except Exception as e:
            return jsonify({"error": str(e)})

def parse_quiz(response):
    quiz = []
    # Parsing logic depends on the format of the Gemini API response
    # Assuming the response is structured as: "Q1. Question?\nA. Option 1\nB. Option 2\nC. Option 3\nD. Option 4\n"
    questions = response.text.split('\n\n')
    for question in questions:
        lines = question.split('\n')
        question_text = lines[0]
        options = lines[1:]
        quiz.append({
            'question': question_text,
            'options': options
        })
    return quiz

if __name__ == "__main__":
    app.run(port=int(os.environ.get('PORT', 80)))
