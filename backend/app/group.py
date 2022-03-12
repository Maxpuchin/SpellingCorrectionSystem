from flask import Blueprint, render_template, request, session, redirect, url_for
from .main import db, app
from .models import Work, Teacher, Group, Student
from eyed3 import load as mp3_load
from .decorators import only_for_teachers, only_for_students

import uuid
import os

group = Blueprint('group', __name__)

@group.route("/add-new-group", methods=["POST"])
@only_for_teachers
def add_new_work():
    data = request.json
    group_name = data["groupName"]
    
    new_group = Group(
        group_name=group_name,
        teacher_id=session["user_id"]
    )

    db.session.add(new_group)
    db.session.commit()

    return {"status": "OK"}, 200
    
@group.route("/get-all-students", methods=["GET"])
@only_for_teachers
def get_all_students():
    students = db.session.query(Student).all()
    users = [{
        "first_name": student.first_name,
        "last_name": student.last_name,
        "login": student.login
    } for student in students]
    return {"status": "OK", "users": users} , 200