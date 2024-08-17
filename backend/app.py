from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

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

if __name__ == '__main__':
    app.run(host='192.168.2.66', port=5000, debug=True, threaded=False)