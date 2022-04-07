from app import db
from app import app
from flask import Blueprint, render_template, abort, flash, redirect, url_for, jsonify, session
from flask_login import login_user, login_required, current_user, logout_user
from flask import request
from models import User
from werkzeug.security import generate_password_hash, check_password_hash


@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    return redirect(url_for('home'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    return redirect(url_for('home'))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))



if __name__ == '__main__':
    app.run(debug=True)

