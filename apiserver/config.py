# -*- coding:utf-8 -*-
from .helpers import env


class Config(object):
    DEBUG = env("DEBUG", cast=bool)
    SQLALCHEMY_DATABASE_URI = env("SQLALCHEMY_DATABASE_URI", cast=str)
    SQLALCHEMY_TRACK_MODIFICATIONS = env("SQLALCHEMY_TRACK_MODIFICATIONS", cast=bool, default=False)
