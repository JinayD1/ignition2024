from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
import google.generativeai as genai
import json

API_KEY = 'AIzaSyDVYH_1-EdSYMZNoXQwptplVj3aUcHPn3A'

genai.configure(api_key=API_KEY)


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    verified = db.Column(db.Boolean, default=False, nullable=False)

    def __repr__(self):
        return '<User %r>' %self.id
    
class NoteDoc(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    content = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),  # Convert datetime to ISO format
            'content': self.content
        }

    def __repr__(self):
        return f'<Document {self.name}>'
    

# User routes
@app.route('/sign_up', methods=['POST'])
def sign_up():
    if request.method == 'POST':
        reqJson = request.get_json()
        print('requestJson: ',reqJson)
        email = reqJson.get('email')
        password = reqJson.get('password')
        newUser = User(email=email,password=password)
        try:
            db.session.add(newUser)
            db.session.commit()
            return {'message': f"Your account was successfully created. A verification email was sent to {email}. If left unverified, your account will soon be deleted."}
        except:
            return {'message': 'There was an issue creating your account.'}
        
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        reqJson = request.get_json()
        print('requestJson: ',reqJson)
        email = reqJson.get('email')
        password = reqJson.get('password')
        userToLogin = User.query.filter_by(email=email).first()
        if userToLogin and userToLogin.password == password:
            return {'message': "You have been successfully logged in!", 'User': userToLogin.id}
        else:
            return {'error': 'Incorrect credentails!'}
        

# NoteDoc routes
@app.route('/create_note', methods=['POST'])
def create_note():
    if request.method == 'POST':
        reqJson = request.get_json()
        print('requestJson: ',reqJson)
        user_id = reqJson.get('userId')
        name = reqJson.get('name')
        NewNoteDoc = NoteDoc(name=name, user_id=user_id, content='')
        try:
            db.session.add(NewNoteDoc)
            db.session.commit()
            return {'message': "Note session document created successfully"}
        except:
            return {'error': 'Failed to create note session.'}
        
@app.route('/get_notes', methods=['POST'])
def get_notes():
    if request.method == 'POST':
        reqJson = request.get_json()
        print('requestJson: ',reqJson)
        try:
            user_id = reqJson.get('userId')
            UserNoteDocs = NoteDoc.query.filter_by(user_id=user_id).all()
            notes_list = [note.to_dict() for note in UserNoteDocs]
            return jsonify(notes_list)
        except:
            return {'error': 'no notes'}
        
@app.route('/update_notes/<int:id>', methods=['POST', 'GET'])
def update_notes(id):
    if request.method == 'POST':
        reqJson = request.get_json()
        print('requestJson: ',reqJson)
        try:
            UpdatedNoteDoc = NoteDoc.query.get_or_404(id)
            UpdatedNoteDoc.content = reqJson.get('content')

            db.session.commit()

            return {'message': f"notes successfully updated: {reqJson.get('content')}"}
        except:
            return {'error': 'no notes'}
    elif request.method == 'GET':
        try:
            GetNoteDoc = NoteDoc.query.get_or_404(id)
            return {'content': f"{GetNoteDoc.content}"}
        except:
            return {'error': 'no notes'}






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

@app.route('/generate_quiz', methods=["POST"])
def generate_quiz():

    if request.method == "POST":
        reqJson = request.get_json()
        notes = reqJson.get('notes')

        model = genai.GenerativeModel('gemini-1.5-flash')
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





if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='192.168.2.66', port=5000, debug=True, threaded=False)
