from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required
from .models import User
from .forms import RegistrationForm, LoginForm

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        existing_user = User.find_by_email(form.email.data)
        if existing_user:
            flash("Email already registered!", "danger")
            return redirect(url_for("auth.register"))

        user_data = User.create_user(form.username.data, form.email.data, form.password.data)
        flash("Account created successfully!", "success")
        return redirect(url_for("auth.login"))
    return render_template("register.html", form=form)

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.find_by_email(form.email.data)
        if user and user.check_password(form.password.data):
            login_user(user)
            return redirect(url_for("dashboard"))  # Change to your home/dashboard route
        else:
            flash("Invalid email or password.", "danger")
    return render_template("login.html", form=form)

@auth_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "info")
    return redirect(url_for("auth.login"))
