from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(
    __name__,
    static_folder="../../frontend/build/static", 
    template_folder="../../frontend/build"
)
app.config.from_object('config')
db = SQLAlchemy(app)

from .models import Teacher, Student, Group, Work, WorkCase

from .views import views
from .auth import auth
from .work import work
from .group import group

app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(views)
app.register_blueprint(group, url_prefix="/group")
app.register_blueprint(work, url_prefix="/work")

# print(app.url_map)

db.create_all()

