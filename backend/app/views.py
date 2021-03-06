from flask import Blueprint, render_template, session, redirect, url_for
from .decorators import only_for_students, only_for_teachers

views = Blueprint('views', __name__)

@views.route("/")
def index():
    if "user_type" not in session:
        return redirect(url_for("views.sign_in"))
    else:
        if session["user_type"] == "student":
            return redirect(url_for("views.student"))
        elif session["user_type"] == "teacher":
            return redirect(url_for("views.teacher"))
        else:
            return redirect(url_for("views.sign_in"))

@views.route("/sign-in")
def sign_in():
    return render_template('index.html')

@views.route("/sign-up")
def sign_up():
    return render_template('index.html')

@views.route("/student")
@only_for_students
def student():    
    return render_template('index.html')

@views.route("/teacher")
@only_for_teachers
def teacher():
    return render_template('index.html')

@views.route("/student/settings")
@only_for_students
def student_settings():
    return render_template('index.html')

@views.route("/teacher/settings")
@only_for_teachers
def teacher_settings():
    return render_template('index.html')

@views.route("/teacher/add-new-work")
@only_for_teachers
def add_new_work():
    return render_template('index.html')

@views.route("/teacher/list-works")
@only_for_teachers
def list_works():
    return render_template('index.html')

@views.route("/student/list-works")
@only_for_students
def list_works_student():
    return render_template('index.html')

@views.route("/teacher/list-works/stats")
@only_for_teachers
def show_cases():
    return render_template('index.html')

@views.route("/teacher/list-works/list-cases")
@only_for_teachers
def show_case__():
    return render_template('index.html')

@views.route("/teacher/list-works/case")
@only_for_teachers
def show_case():
    return render_template('index.html')

@views.route("/teacher/groups")
@only_for_teachers
def add_new_group():
    return render_template("index.html")

@views.route("/student/list-works/participate")
@only_for_students
def essay_page():
    return render_template("index.html")

@views.route("/student/list-works/results")
@only_for_students
def results_page():
    return render_template("index.html")