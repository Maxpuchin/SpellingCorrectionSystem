from flask import Blueprint, render_template, request, session, redirect, url_for
from .main import db
from .models import Teacher, Student

auth = Blueprint('auth', __name__)

@auth.route("/load-user", methods=["GET"])
def load_user():
    return {
        "userLogin": session["user_login"] if "user_login" in session else "guest",
        "userType": session["user_type"] if "user_type" in session else "guest"
    }, 200

@auth.route("/logout", methods=["GET"])
def logout():
    session.clear()

    return {}, 200

@auth.route("/sign-up", methods=["POST"])
def sign_up():
    try:
        account_data = request.json
        
        login = account_data["login"]
        password = account_data["password"]
        first_name = account_data["firstName"]
        last_name = account_data["lastName"]
        is_teacher = account_data["isTeacher"]

        match_teacher = db.session.query(Teacher).filter(Teacher.login == login).all()
        match_student = db.session.query(Student).filter(Student.login == login).all()

        if len(match_teacher) + len(match_student) > 0:
            return {"status": "Аккаунт с таким именем уже существует."}, 200
    
        if is_teacher:
            new_user = Teacher(
                login=login,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
        else:
            new_user = Student(
                login=login,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )

        db.session.add(new_user)
        db.session.commit()
    
        return {"status": "OK"}, 200
    except Exception as e:
        print(e)
        return {"status": "Проверьте корректность введенных данных!"}, 200

@auth.route("/sign-in", methods=["POST"])
def sign_in():
    try:
        account_data = request.json

        login = account_data["login"]
        password = account_data["password"]
        
        match_teacher = db.session.query(Teacher).filter(Teacher.login == login).all()
        match_student = db.session.query(Student).filter(Student.login == login).all()

        if len(match_student) + len(match_teacher) == 0:
            return {"status": "Нет аккаунта с таким именем пользователя."}, 200
        
        if len(match_student) == 1:
            if match_student[0].password == password:
                session["user_id"] = match_student[0].student_id
                session["user_login"] = match_student[0].login
                session["user_type"] = "student"
                return {"status": "OK", "url": "/student"}, 200
            else:
                return {"status": "Неверный пароль."}, 200

        elif len(match_teacher) == 1:
            if match_teacher[0].password == password:
                session["user_id"] = match_teacher[0].teacher_id
                session["user_login"] = match_teacher[0].login
                session["user_type"] = "teacher"
                return {"status": "OK", "url": "/teacher"}, 200
            else:
                return {"status": "Неверный пароль."}, 200
    except:
        return {"status": "Неизвестная ошибка."}, 200