# pylint: disable=no-member
"""This is the main driver for the app, it has the database models and the routes"""
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class User(db.Model, UserMixin):
    """This is the database table for the User"""
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(350), nullable=False)

    def __repr__(self):
        """Represents the user currently logged in"""
        return f"<{self.id}:{self.user_name}>"

    def __init__(self, password,user_name):
        self.user_name = user_name
        self.password = generate_password_hash(password)

    def verify_password(self,pwd):
        return check_password_hash(self.password, pwd)


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

    def reviews(self):
        """Returns the comment entered"""
        return self.review


db.create_all()