# -*- coding:utf-8 -*-

from flask import Flask
from .config import Config
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
app = Flask(__name__)

# config
app.config.from_object(Config)

# init ext
db.init_app(app)
from .models import init_model
init_model()

# app router
from .views import bp_target, bp_default
app.register_blueprint(bp_target, url_prefix='/v1/target')
app.register_blueprint(bp_default, url_prefix="/v1/default")
