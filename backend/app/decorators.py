from flask import session, redirect, url_for
from functools import wraps

def only_for_students(func):
    @wraps(func)
    def wrapper_student(*args, **kwargs):
        if "user_type" not in session:
            return redirect(url_for("views.sign_in"))
        else:
            if session["user_type"] != "student":
                return redirect(url_for("views.sign_in"))
            else:
                return func(*args, **kwargs)

    return wrapper_student

def only_for_teachers(func):
    @wraps(func)
    def wrapper_teacher(*args, **kwargs):
        if "user_type" not in session:
            return redirect(url_for("views.sign_in"))
        else:
            if session["user_type"] != "teacher":
                return redirect(url_for("views.sign_in"))
            else:
                return func(*args, **kwargs)

    return wrapper_teacher