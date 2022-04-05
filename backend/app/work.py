from cProfile import label
import collections
from datetime import date, datetime
from time import time

from flask import Blueprint, render_template, request, session, redirect, url_for, send_file
from .main import db, app
from .models import Group, Student, Work, Teacher, WorkCase
from eyed3 import load as mp3_load
from .decorators import only_for_teachers, only_for_students, only_for_logged
from .corrector import Corrector
from .funcs import *

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
                dictation_file_name=dict_audio_name,
                groups=matched_groups
            )

            db.session.add(new_work)
            db.session.commit()
        else:
        
            try:
                essay_topic = data["taskTopic"]

                if essay_topic == "":
                    return {"status": "Тема сочинения пустая!"} 
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
    except Exception as e:
        raise e
        if "UNIQUE" in str(e):
            return {"status": "Выберите другое название."}, 200
        return {"status": "Неизвестная ошибка добавления задания."}, 200

    return {"status": "OK"}, 200

@work.route("/get-teachers-works")
@only_for_teachers
def get_works():
    teacher = get_teacher_by_id(session["user_id"])
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
    student = get_student_by_id(session["user_id"])
    works = collections.defaultdict(list)

    status2color = {
        "not started": "info",
        "in process": "error",
        "auto graded": "warning",
        "teacher graded": "success"
    }

    status2text = {
        "not started": "Вы пока не начинали эту работу.",
        "in process": "Вы в процессе написания этой работы.",
        "auto graded": "Работа была оценена автоматически.",
        "teacher graded": "Работа оценена учителем."
    }

    status2button = {
        "not started": "Приступить",
        "in process": "Продолжить",
        "auto graded": "Посмотреть результаты",
        "teacher graded": "Посмотреть результаты"
    }

    status2finished = {
        "not started": False,
        "in process": False,
        "auto graded": True,
        "teacher graded": True
    }

    for group in student.groups:
        for work in group.works:
            work_data = dict()
            work_data["name"] = work.work_name
            work_data["type"] = "Сочинение" if work.is_essay == True else "Диктант"
            work_data["time"] = work.creation_time
            status = "not started"

            work_data["auto grade"] = None
            work_data["teacher grade"] = None

            for work_case in work.work_cases:
                if work_case.student_id == student.student_id:
                    status = work_case.status
                    work_data["auto grade"] = work_case.auto_grade
                    work_data["teacher grade"] = work_case.teacher_grade

            work_data["color"] = status2color[status]
            work_data["text"] = status2text[status]
            work_data["button"] = status2button[status]
            work_data["finished"] = status2finished[status]

            works[group.group_name].append(
                work_data
            )

    for group_name in works:
        works[group_name] = sorted(
            works[group_name], 
            key=lambda x: x["time"], 
            reverse=True
        )
        
    return { "status": "OK", "works": works }, 200

@work.route("/start")
@only_for_students
def start_work():
    work_name = request.args.get("name")
    matched_work = get_work_by_name(work_name)
    start_time = datetime.now()
    status = "in process"
    student_id = session["user_id"]
    
    # ПРОВЕРИТЬ, что такого ворккейса еще нет.

    work_case = WorkCase(
        start_time=start_time,
        student_id=student_id,
        work_id=matched_work.work_id,
        status=status
    )

    seconds_left = matched_work.minutes_to_finish * 60

    db.session.add(work_case)
    db.session.commit()
    
    return {"status": status, "time_left": seconds_left}, 200

@work.route("/results", methods=["GET"])
@only_for_logged
def get_work_results():
    # результаты выглядят так:
    # название задания
    # текст, исправленный алгоритмом
    # оценка алгоритма
    # статус оценки преподавателя
    # оценка преподавателя
    # если оценка стоит, то текст исправленный алгоритмом заменяется на препода
    # если оценка стоит, то дать возможность исправить ошибки.

    args = request.args 
    case_id = args.get("workCaseId")
    work_case = get_work_case_by_id(case_id)
    work = get_work_by_id(work_case.work_id)

#     assert work_case.student_id == session["user_id"]

    blocks_corrected, _, _ = corrector.get_difference_and_mark(work_case.text_written, work_case.auto_corrected_text)

    if work_case.status == "teacher graded":
        blocks_corrected, _, _ = corrector.get_difference_and_mark(work_case.text_written, work_case.teacher_corrected_text)

    data = {
        "work_name": work.work_name,
        "is_essay": work.is_essay,
        "status": work_case.status,
        "text_written": work_case.text_written,
        "corrected_text": blocks_corrected,
        "auto_grade": work_case.auto_grade,
        "teacher_grade": work_case.teacher_grade,
        "cw_done": work_case.cw_done
    }

    return {"results": data}, 200
    
@work.route("/url", methods=["GET"])
@only_for_students
def get_url():
    work_name = request.args.get("workName")
    print(work_name)
    student = get_student_by_id(session["user_id"])
    url = "/student/list-works/participate?name=" + work_name

    for work_case in student.work_cases:
        if get_work_by_id(work_case.work_id).work_name == work_name and \
            work_case.student_id == student.student_id and \
            "grade" in work_case.status:
            url = "/student/list-works/results?workCaseId=" + str(work_case.work_case_id)
            
    return { "url": url }, 200

@work.route("/finish", methods=["POST"])
@only_for_students
def finish_essay():
    # человек закончил писать эссе. 
    # он отсылает сюда название эссе, написанный текст
    # возвращаем ему ОК, когда проверим.

    name = request.json["name"]
    text_written = request.json["text_written"]
    student_id = session["user_id"]
    matched_work = get_work_by_name(name)
    id_to_modify = -1

    if matched_work.is_essay:

        for step, case in enumerate(matched_work.work_cases):
            if case.student_id == student_id:
                id_to_modify = step
        
        matched_work.work_cases[id_to_modify].status = "auto graded"
        matched_work.work_cases[id_to_modify].text_written = text_written

        (_, auto_grade, auto_corrected_text) = corrector.correct_and_get_difference(text_written)

        matched_work.work_cases[id_to_modify].auto_grade = auto_grade
        matched_work.work_cases[id_to_modify].auto_corrected_text = auto_corrected_text
        matched_work.work_cases[id_to_modify].end_time = datetime.now()

        db.session.commit()

        url = "/student/list-works/results?workCaseId=" + str(matched_work.work_cases[id_to_modify].work_case_id)

        return { 
            "url": url 
        }, 200

    else:

        for step, case in enumerate(matched_work.work_cases):
            if case.student_id == student_id:
                id_to_modify = step
        
        matched_work.work_cases[id_to_modify].status = "auto graded"
        matched_work.work_cases[id_to_modify].text_written = text_written

        (_, auto_grade, auto_corrected_text) = corrector.get_difference_and_mark(text_written, matched_work.dictation_text)

        matched_work.work_cases[id_to_modify].auto_grade = auto_grade
        matched_work.work_cases[id_to_modify].auto_corrected_text = auto_corrected_text
        matched_work.work_cases[id_to_modify].end_time = datetime.now()

        db.session.commit()

        url = "/student/list-works/results?workCaseId=" + str(matched_work.work_cases[id_to_modify].work_case_id)

        return { 
            "url": url 
        }, 200

@work.route("/audio")
def get_dict_audio():
    audio_name = request.args.get("audioName")
    path = os.getcwd() + "/data/" + audio_name
    print(path)

    return send_file(path) 


@work.route("/info")
@only_for_students
def get_work_info():
    student_id = session["user_id"]
    name = request.args.get("name")
    status = "not started"
    time_left = -1
    matched_work = get_work_by_name(name)
    seconds_at_all = matched_work.minutes_to_finish * 60
    dict_audio = None
    essay_topic = None

    for case in matched_work.work_cases:
        if case.student_id == student_id:
            status = case.status
            time_left = seconds_at_all - int((datetime.now() - case.start_time).total_seconds())
            break

    if matched_work.is_essay == False:        
        dict_audio = matched_work.dictation_file_name
    else:
        essay_topic = matched_work.essay_topic

    return {
        "status": status,
        "is_essay": matched_work.is_essay,
        "dictation_audio": dict_audio,
        "essay_topic": essay_topic,
        "seconds_left": time_left
    }, 200

@work.route("/cases", methods=["GET"])
@only_for_teachers
def get_cases():
    print(1)
    work_name = request.args.get("workname")
    print(work_name)
    teacher = get_teacher_by_id(session["user_id"])

    work_cases = []

    for work in teacher.works_created:
        if work.work_name == work_name:
            for work_case in work.work_cases:
                severity = "info"
                text = ""

                if work_case.status == "auto graded":
                    severity = "error"
                    text = "Работа завершена. Требуется оценка преподавателя."
                elif work_case.status == "in process":
                    severity = "warning"
                    text = "Ученик в процессе написания работы."
                else:
                    severity = "success"
                    text = "Работа успешно оценена. Дополнительных действий не требуется."
                    
                student = get_student_by_id(work_case.student_id)

                work_cases.append(
                    {
                        "severity": severity,
                        "full_name": student.login + " (" + student.first_name + " " + student.last_name + ")",
                        "text": text,
                        "start_time": str(work_case.start_time),
                        "work_case_id": work_case.work_case_id
                    }
                )

    return {"result": work_cases}, 200

@work.route("/mark", methods=["POST"])
@only_for_teachers
def set_mark():
    data = request.json 
    print(data["mark"], data["workCaseId"])

    work_case = get_work_case_by_id(data["workCaseId"])
    work_case.teacher_corrected_text = data["teacherCorrectedText"]
    work_case.teacher_grade = data["mark"]
    work_case.status = "teacher graded"

    db.session.commit()

    return {}, 200

@work.route("/set-correction-work", methods=["GET"])
@only_for_students
def set_corrections():
    work_case_id = request.args.get("workCaseId")
    work_case = get_work_case_by_id(work_case_id)
    work_case.cw_done = True

    return {}, 200
