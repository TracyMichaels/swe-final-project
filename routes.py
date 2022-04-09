# pylint: disable=unused-import
# This is a temporary diabling message, we will eventually use all of these imports
"""These are the routes of the app, which help us navigate through it with different endpoints"""
import flask
from flask_login import LoginManager
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

bp = flask.Blueprint(
    "bp",
    __name__,
    template_folder="./static/react",
)

@login_manager.user_loader
def load_user(user_id):
    """This function will load user"""
    return User.query.get(user_id)

@app.route("/")
def index():
    """This function will render the index page"""
    return render_template("index.html")
    
@app.route("/login")
def login():
    """This displays the login page"""
    return render_template("login.html")

@app.route("/register")
def register():
    """Displays the sign up page"""
    return render_template("register.html")

@bp.route("/login", methods=["POST"])
def login_form():
    """This form checks if user is already a member"""
    user = request.form.get("username")
    password = request.form.get("password")
    user_query = User.query.filter_by(user_name=user).first()

    if user_query and user_query.verify_password(password):
        login_user(user_query)
        return render_template("index.html")
    else:
        return jsonify({"status": 401, "reason": "Username or Password Error"})

@app.route('/register', methods=["POST"])
def register_form():
    """Signs up new user"""
    user = request.form.get("username")
    pwd = request.form.get("password")
    new_user = User(user_name=user,password=pwd)
    user_query = User.query.filter_by(user_name=user).first()
    if user_query:
        return jsonify({"status": 401, "reason": "Username taken"})
    else:
        db.session.add(new_user)
        db.session.commit()
    return redirect(flask.url_for("login"))

app.register_blueprint(bp)

if __name__ == "__main__":
    app.run(debug=True)
