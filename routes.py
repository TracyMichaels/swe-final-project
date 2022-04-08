# pylint: disable=unused-import
# This is a temporary diabling message, we will eventually use all of these imports
"""These are the routes of the app, which help us navigate through it with different endpoints"""
import flask
from flask_login import login_user, LoginManager
from flask import (
    Blueprint,
    render_template,
    abort,
    flash,
    redirect,
    url_for,
    jsonify,
    session,
    request,
)
from flask_login import login_user, login_required, current_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from app import db, app
from models import User

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

@app.route("/")
@app.route("/home")
def home():
    """This is the primary page, the one the user lands on after opening the app"""
    return render_template("home.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    """Lets the user log in to their account"""
    return redirect(url_for("home"))

@app.route("/login", methods=["POST"])
def login_form():
    user = flask.request.form.get("username")
    password = flask.request.form.get("password")
    user_query = User.query.filter_by(user_name=user).first()
    if user_query and user_query.verify_password(password):
        login_user(user_query)
        return flask.render_template("home.html")
    else:
        return flask.jsonify({"status": 401, "reason": "Username or Password Error"})

@app.route("/register", methods=["GET", "POST"])
def register():
    """Allows the user to sign up with an account"""
    return redirect(url_for("home"))

@app.route('/register', methods=["POST"])
def register_form():
    user = flask.request.form.get("username")
    pwd = flask.request.form.get("password")
    new_user = User(user_name=user,password=pwd)
    user_query = User.query.filter_by(user_name=user).first()
    if user_query:
        return flask.jsonify({"status": 401, "reason": "Username taken"})
    else:
        db.session.add(new_user)
        db.session.commit()
    return flask.redirect(flask.url_for("login"))

@app.route("/logout")
@login_required
def logout():
    """Logs the user out and returns to the main page"""
    logout_user()
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)

