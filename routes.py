# pylint: disable=unused-import
# This is a temporary diabling message, we will eventually use all of these imports
"""These are the routes of the app, which help us navigate through it with different endpoints"""
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


@app.route("/")
@app.route("/home")
def home():
    """This is the primary page, the one the user lands on after opening the app"""
    return render_template("home.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Lets the user log in to their account"""
    return redirect(url_for("home"))


@app.route("/register", methods=["GET", "POST"])
def register():
    """Allows the user to sign up with an account"""
    return redirect(url_for("home"))


@app.route("/logout")
@login_required
def logout():
    """Logs the user out and returns to the main page"""
    logout_user()
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)
