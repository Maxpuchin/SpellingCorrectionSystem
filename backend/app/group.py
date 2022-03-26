import collections
import grp
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
def add_new_group():
    data = request.json

    group_name = data["group_name"]

    if group_name == "":
        return {"status": "Введите имя!"}, 200

    participant_names = data["participants"]

    if len(participant_names) == 0:
        return {"status": "Нет участников."}, 200

    participants = []

    for participant in participant_names:
        login = participant.split(" (")[0]
        print(login)
        match_participant = db.session.query(Student) \
                            .filter(Student.login == login).all()
        
        if len(match_participant) == 0:
            return {"status": "Пользователь {login} не существует."}, 200
        else:
            participants.append(match_participant[0])

    new_group = Group(
        group_name=group_name,
        teacher_id=session["user_id"]
    )
    
    for participant_object in participants:
        new_group.students.append(participant_object)

    try:
        db.session.add(new_group)
        db.session.commit()
    except Exception as e:
        print(e)
        if "UNIQUE" in str(e):

            return {"status": "Группа с таким именем уже существует."}, 200
        else:
            return {"status": "Неизвестная ошибка создания группы."}, 200

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
    return { "status": "OK", "users": users } , 200

@group.route("/get-all-groups", methods=["GET"])
@only_for_teachers
def get_all_groups():
    match_teacher = db.session \
                    .query(Teacher) \
                    .filter(Teacher.teacher_id == session["user_id"]) \
                    .all()[0]

    groups = []
    for group in match_teacher.groups_created:
        group_data = collections.defaultdict(list)
        group_data["group_name"] = group.group_name
        group_data["participants"] = []

        for student in group.students:
            group_data["participants"].append(
                {
                    "login": student.login,
                    "full_name": student.first_name + " " + student.last_name
                }
            )
        
        groups.append(group_data)

    return {"groups": groups}, 200

@group.route("/delete-user", methods=["POST"])
@only_for_teachers
def delete_user_from_group():
    data = request.json
    group_name = data["group_name"]
    login = data["login"]

    group_match = db.session \
                    .query(Group) \
                    .filter(Group.group_name == group_name) \
                    .all()[0]
    
    id_to_remove = None

    for id, student in enumerate(group_match.students):
        if student.login == login:
            id_to_remove = id
            break

    group_match.students.pop(id_to_remove)

    db.session.commit()

    return {}, 200

@group.route("/delete-group", methods=["POST"])
@only_for_teachers
def delete_group():
    data = request.json
    group_name = data["group_name"]
    
    group_match = db.session \
    .query(Group) \
    .filter(Group.group_name == group_name) \
    .all()[0]

    group_match.students = []

    db.session \
    .query(Group) \
    .filter(Group.group_name == group_name) \
    .delete()

    db.session.commit()

    return {}, 200