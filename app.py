# pylint: disable=no-member
"""This is the main driver for the app, it has the database models and the routes"""
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from dotenv import find_dotenv, load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv(find_dotenv())

app = Flask(__name__)
database = os.getenv("database")
app.config["SQLALCHEMY_DATABASE_URI"] = database
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = b"Nothing in here, this is to protect from de-frauding"
db = SQLAlchemy(app)


class User(db.Model, UserMixin):
    """This is the database table for the User"""
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(350), nullable=False)

    def __repr__(self):
        """Represents the user currently logged in"""
        return f"<{self.id}:{self.first_name}>"

    def hash_pwd(self, passw):
        """Hashes to encrypt the password"""
        self.password = generate_password_hash(passw)

    def check_password(self, passw):
        """Checks if the entered password is right"""
        return check_password_hash(self.password, passw)


class Reviews(db.Model):
    """This is the database table for the reviews that are left on each video/playlist"""
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    video_title = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("User.id"), nullable=False)
    review = db.Column(db.String(280), nullable=False)
    video_id = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        """Represents the video commented and the user id"""
        return f"<{self.video_id}:{self.user_id}>"

    def review(self):
        """Returns the comment entered"""
        return self.review

db.create_all()
