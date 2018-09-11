# coding:utf-8

from .target import Target
from apiserver import db, app


def init_model():
    db.create_all(app=app)
