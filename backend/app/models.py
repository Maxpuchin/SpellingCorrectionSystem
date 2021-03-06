from .main import db

import datetime

class Teacher(db.Model):
    __tablename__ = 'teachers'

    teacher_id = db.Column(
        db.Integer, 
        primary_key=True
    )

    login = db.Column(
        db.String(20), 
        nullable=False, 
        index=True, 
        unique=True
    )

    password = db.Column(
        db.String(20), 
        nullable=False,
        index=False,
        unique=False
    )

    first_name = db.Column(
        db.String(20),
        nullable=False,
        index=False,
        unique=False
    )

    last_name = db.Column(
        db.String(20),
        nullable=False,
        index=False,
        unique=False    
    )

    groups_created = db.relationship("Group")
    works_created = db.relationship("Work")


class Student2GroupAssociation(db.Model):
    __tablename__ = "student2groupassociation"
    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.student_id"),
        primary_key=True
    )

    group_id = db.Column(
        db.Integer,
        db.ForeignKey("groups.group_id"),
        primary_key=True
    )

class Work2GroupAssociation(db.Model):
    __tablename__ = "work2groupassociation"
    work_id = db.Column(
        db.Integer,
        db.ForeignKey("works.work_id"),
        primary_key=True
    )

    group_id = db.Column(
        db.Integer,
        db.ForeignKey("groups.group_id"),
        primary_key=True
    )

class Student(db.Model):
    __tablename__ = 'students'

    student_id = db.Column(
        db.Integer, 
        primary_key=True
    )

    login = db.Column(
        db.String(20), 
        nullable=False, 
        index=True, 
        unique=True
    )

    password = db.Column(
        db.String(20), 
        nullable=False,
        index=False,
        unique=False
    )

    first_name = db.Column(
        db.String(20),
        nullable=False,
        index=False,
        unique=False
    )

    last_name = db.Column(
        db.String(20),
        nullable=False,
        index=False,
        unique=False    
    )


    groups = db.relationship("Group", secondary="student2groupassociation")
    work_cases = db.relationship("WorkCase")


class Work(db.Model):
    __tablename__ = 'works'

    work_id = db.Column(
        db.Integer, 
        primary_key=True
    )

    teacher_id = db.Column(
        db.Integer,
        db.ForeignKey("teachers.teacher_id"),
        nullable=False,
        index=True
    )

    creation_time = db.Column(
        db.DateTime,
        default=datetime.datetime.utcnow
    )

    work_name = db.Column(
        db.String(20),
        nullable=False,
        index=True,
        unique=True
    )

    is_essay = db.Column(
        db.Boolean,
        nullable=False,
        index=True,
        unique=False
    )

    essay_topic = db.Column(
        db.String(1000),
        nullable=True,
        index=False,
        unique=True
    )

    dictation_text = db.Column(
        db.String(10000),
        nullable=True,
        index=False,
        unique=False
    )

    dictation_file_name = db.Column(
        db.String(100),
        nullable=True,
        index=False,
        unique=True
    )

    minutes_to_finish = db.Column(
        db.Integer,
        default=45
    )

    work_cases = db.relationship("WorkCase")
    groups = db.relationship("Group", secondary="work2groupassociation")

class Group(db.Model):
    __tablename__ = "groups"

    group_id = db.Column(
        db.Integer,
        primary_key=True
    )

    group_name = db.Column(
        db.String(100),
        index=True,
        nullable=False,
        unique=True
    )

    teacher_id = db.Column(
        db.Integer,
        db.ForeignKey("teachers.teacher_id")
    )

    students = db.relationship("Student", secondary="student2groupassociation")
    works = db.relationship("Work", secondary="work2groupassociation")



class WorkCase(db.Model):
    __tablename__ = "work_cases"

    work_case_id = db.Column(
        db.Integer,
        primary_key=True
    )

    start_time = db.Column(
        db.DateTime,
       #  default=datetime.datetime.utcnow
    )

    end_time = db.Column(
        db.DateTime,
        # default=datetime.datetime.utcnow
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.student_id")
    )

    work_id = db.Column(
        db.Integer,
        db.ForeignKey("works.work_id")
    )

    auto_grade = db.Column(
        db.Integer,
        nullable=True,
        unique=False,
        index=False
    )

    teacher_grade = db.Column(
        db.Integer,
        nullable=True,
        unique=False,
        index=False
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        unique=False,
        index=True
    )

    # status may be: ["not started", "in process", "auto graded", "teacher graded", "corrected"]

    text_written = db.Column(
        db.Text,
        nullable=True,
        unique=False,
        index=True
    )

    auto_corrected_text = db.Column(
        db.Text,
        nullable=True,
        unique=False,
        index=True
    )

    teacher_corrected_text = db.Column(
        db.Text,
        nullable=True,
        unique=False,
        index=True
    )

    cw_done = db.Column(
        db.Boolean,
        default=False,
        index=True,
        unique=False
    )

    
