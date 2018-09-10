# coding:utf-8

from flask import Blueprint, request
from apiserver.repositorys.props import auth, success, error, panic
from apiserver.types.default import UpdateSchema
from apiserver.models import Default
from apiserver import db

bp_default = Blueprint("bp_default", __name__)


@bp_default.route("/update", methods=["POST"])
@panic(UpdateSchema)
def update_default(args):
    default = Default.query.first()
    if default:
        default.brokers = args.get("brokers")
        default.topic = args.get("topic")
        default.interval = args.get("interval")
    else:
        default = Default(**args)
        db.session.add(default)
    db.session.commit()
    return success({
        "result": default.to_dict()
    })


@bp_default.route("/get", methods=["GET"])
@panic()
def get_default():
    default = Default.query.first()
    res = None
    if default:
        res = default.to_dict()
    return success({
        "result": res
    })
