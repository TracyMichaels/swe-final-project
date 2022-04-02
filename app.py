import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from dotenv import find_dotenv, load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv(find_dotenv())

app = Flask(__name__)
database = os.getenv('database')
app.config["SQLALCHEMY_DATABASE_URI"] = database
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = b"Nothing in here"
db = SQLAlchemy(app)


class User(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	user_name = db.Column(db.String(80), unique=True, nullable=False)
	password = db.Column(db.String(350), nullable=False)

	def __repr__(self):
	        return f"<{self.id}:{self.first_name}>"

    	def hash_pwd(self, passw):
                self.password = generate_password_hash(passw)

    	def check_password(self, passw):
        	return check_password_hash(self.password, passw)

class Reviews(db.Model):
	id = db.Column(db.Integer, primary_key=True, nullable=False)
	video_title = db.Column(db.String(50), nullable=False)
	user_id = db.Column(db.Integer, nullable=False)
	review = db.Column(db.String(280), nullable=False)

	def __repr__(self):
        	return f"<{self.movie_id}:{self.user_id}>"
	
	def comment(self):
        	return self.review

db.create_all()
