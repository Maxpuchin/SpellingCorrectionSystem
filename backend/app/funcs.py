from typing import List

from .main import db
from .models import Group, Student, Work, WorkCase, Teacher


def get_teacher_by_id(id) -> Teacher:
    student = \
        db.session.query(Teacher) \
        .filter(Teacher.teacher_id == id) \
        .all()[0]

    return student

def get_student_by_id(id) -> Student:
    student = \
        db.session.query(Student) \
        .filter(Student.student_id == id) \
        .all()[0]

    return student

def get_work_case_by_id(id) -> WorkCase:
    work_case = \
        db.session.query(WorkCase) \
        .filter(WorkCase.work_case_id == id) \
        .all()[0]

    return work_case

def get_work_by_id(id) -> Work:
    work = \
        db.session.query(Work) \
        .filter(Work.work_id == id) \
        .all()[0]

    return work

def get_work_by_name(name) -> Work:
    work = \
        db.session.query(Work) \
        .filter(Work.work_name == name) \
        .all()[0]

    return work

def is_wc_available_for_student(student_id, work_case):
    student = get_student_by_id(student_id)

    if work_case in student.work_cases:
        return True
    else:
        return False

def is_wc_available_for_teacher(teacher_id, work_case):
    teacher = get_teacher_by_id(teacher_id)

    for work in teacher.works_created:
        if work_case in work.work_cases:
            return True

    return False