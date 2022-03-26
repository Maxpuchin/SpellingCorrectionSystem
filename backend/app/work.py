import collections
from tokenize import group
from flask import Blueprint, render_template, request, session, redirect, url_for
from .main import db, app
from .models import Group, Student, Work, Teacher
from eyed3 import load as mp3_load
from .decorators import only_for_teachers, only_for_students
from .corrector import Corrector

import uuid
import os

work = Blueprint('work', __name__)

corrector = Corrector(app.config["PATH_TO_CORRECTOR"])

ALLOWED_EXTENSIONS = ["mp3"]

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@work.route("/add-new-work", methods=["POST"])
@only_for_teachers
def add_new_work():
    data = request.form
    
    try:
        work_name = data["workName"]
        work_type = data["workType"]
        selected_groups = data.getlist("groupsSelected[]")
    except:
        return {"status": "Проверьте корректность введенных данных!"}, 200

    matched_groups = db.session.query(Group) \
        .filter(Group.group_name.in_(selected_groups)) \
        .all()

    if work_type == "Диктант":
        file_path = ""

        try:
            dict_audio = request.files["taskAudio"]
            if dict_audio.filename == "":
                return {"status": "Файл не был загружен!"}, 200
            if dict_audio and allowed_file(dict_audio.filename):
                dict_audio_name = str(uuid.uuid4())
                file_path = os.path.join(app.config["UPLOAD_FOLDER"], dict_audio_name)
                dict_audio.save(file_path )
                file_verify = mp3_load(file_path)
                
                if file_verify == None:
                    os.remove(file_path)
                    return {"status": "Файл не соответствует формату!"}, 200
        except:
            return {"status": "Файл поврежден!"}, 200

        try:
            dict_text = data["taskText"]
        except:
            return {"status": "Проверьте текст диктанта!"}, 200

        new_work = Work(
            teacher_id=session["user_id"],
            is_essay=False,
            work_name=work_name,
            dictation_text = dict_text,
            dictation_file_name=file_path,
            groups=matched_groups
        )

        db.session.add(new_work)
        db.session.commit()
    else:
        try:
            essay_topic = data["taskTopic"]
        except:
            return {"status": "Проверьте тему сочинения!"}
        
        new_work = Work(
            teacher_id=session["user_id"],
            is_essay=True,
            work_name=work_name,
            essay_topic=essay_topic,
            groups=matched_groups
        )
        
        db.session.add(new_work)
        db.session.commit()

    return {"status": "OK"}, 200

@work.route("/get-teachers-works")
@only_for_teachers
def get_works():
    teacher = \
        db.session.query(Teacher) \
        .filter(Teacher.login == session["user_login"]) \
        .all()[0]
    
    works = []

    for work in teacher.works_created:
        work_data = dict()
        work_data["name"] = work.work_name
        work_data["type"] = "Сочинение" if work.is_essay == True else "Диктант"
        work_data["time"] = work.creation_time

        works.append(work_data)
        
    return { "status": "OK", "works": works }, 200

@work.route("/get-student-works")
@only_for_students
def get_student_works():
    student = \
        db.session.query(Student) \
        .filter(Student.login == session["user_login"]) \
        .all()[0]
    
    works = collections.defaultdict(list)

    for group in student.groups:
        for work in group.works:
            work_data = dict()
            work_data["name"] = work.work_name
            work_data["type"] = "Сочинение" if work.is_essay == True else "Диктант"
            work_data["time"] = work.creation_time

            works[group.group_name].append(work_data)
        
    return { "status": "OK", "works": works }, 200

@work.route("/get-essay-info/<name>")
@only_for_students
def get_essay_info(name):
    matched_essay = db.session.query(Work) \
        .filter(Work.work_name == name and Work.is_essay == True) \
        .all()[0]

    return {"status": "OK", "topic": matched_essay.essay_topic}, 200

@work.route("/correct-text", methods=["POST"])
@only_for_students
def correct_text():
    text = request.json["text"]
    print(text)
    corrected = corrector.get_difference_and_candidates(text)
    print(corrected)
    return {"corrected": corrected}, 200