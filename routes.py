# pylint: disable=unused-import
# pylint: disable=no-member
"""These are the routes of the app, which help us navigate through it with different endpoints"""
import os
import flask
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
from flask_login import (
    LoginManager,
    login_user,
    login_required,
    current_user,
    logout_user,
)
from werkzeug.security import generate_password_hash, check_password_hash
from app import db, app
from models import User, Reviews

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
    flash("username or password incorrect")
    return render_template("login.html")

@app.route("/userLoggedIn")
def user_logged_in():
    """This method returns if the user is logged in"""
    return jsonify({"logged_in": current_user.is_authenticated})

@app.route("/addComment", methods=["GET", "POST"])
def comment_it():
    """This adds a comment to the database for the specific video"""
    info = request.json
    video_title = info["videoTitle"][:100]
    success = current_user.is_authenticated
    if request.method == "POST" and success:
        record = Reviews(
            video_title=video_title,
            user_id=current_user.id,
            review=info["comment"][:280],
            video_id=info["videoId"],
        )
        db.session.add(record)
    db.session.commit()
    comments = Reviews.query.filter_by(video_id=info["videoId"]).all()
    comment_list = []
    for comment in comments:
        comment_list.append(
            {
                "user": User.query.filter_by(id=comment.user_id).first().user_name,
                "text": comment.review,
            }
        )

    return jsonify({"comment_list": comment_list})

@app.route("/getComments", methods=["GET", "POST"])
def render_comments():
    """This gets all the comments back from the database"""

    comments = Reviews.query.filter_by(video_id=request.args.get("videoId")).all()

    comment_list = []
    for comment in comments:
        comment_list.append(
            {
                "user": User.query.filter_by(id=comment.user_id).first().user_name,
                "text": comment.review,
            }
        )

    return jsonify({"comment_list": comment_list})

@app.route("/register", methods=["POST"])
def register_form():
    """Signs up new user"""
    user = request.form.get("username")
    pwd = request.form.get("password")
    new_user = User(user_name=user, password=pwd)
    user_query = User.query.filter_by(user_name=user).first()
    if user_query:
        flash("Sorry... username taken")
        return redirect(flask.url_for("register"))
    db.session.add(new_user)
    db.session.commit()
    return redirect(flask.url_for("login"))


@bp.route("/logout")
def logout():
    """Logs the user out of the app, redirects him/her to the login page"""
    return render_template("login.html")


app.register_blueprint(bp)

if __name__ == "__main__":
    app.run(debug=True)
    #app.run(os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", "8080")), debug=True)
