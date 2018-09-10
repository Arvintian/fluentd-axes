# -*- coding:utf-8 -*-

from flask import Blueprint, request
from sqlalchemy import desc
from apiserver.repositorys.props import auth, success, error, panic
from apiserver.types.target import AddSchema, UpdateSchema, DeleteSchema
from apiserver.models import Target
from apiserver import db

bp_target = Blueprint("bp_target", __name__)


@bp_target.route("/add", methods=["POST"])
@panic(AddSchema)
def add_target(args):
    target = Target(name=args.get("name"))
    if args.get("brokers", None):
        target.brokers = args.get("brokers")
    if args.get("target", None):
        target.target = args.get("target")
    if args.get("topic", None):
        target.topic = args.get("topic")
    if args.get("interval", None):
        target.interval = args.get("interval")
    db.session.add(target)
    db.session.commit()
    return success({
        "result": {
            "id": target.id,
            "name": target.name
        }
    })


@bp_target.route("/update", methods=["POST"])
@panic(UpdateSchema)
def update_target(args):
    target = Target.query.filter_by(id=args.get("id")).first()
    if not target:
        return error(reason="没有该记录")
    if args.get("name", None):
        target.name = args.get("name")
    if args.get("brokers", None):
        target.brokers = args.get("brokers")
    if args.get("target", None):
        target.target = args.get("target")
    if args.get("topic", None):
        target.topic = args.get("topic")
    if args.get("interval", None):
        target.interval = args.get("interval")
    db.session.commit()
    return success({
        "result": target.to_dict()
    })


@bp_target.route("/delete", methods=["POST"])
@panic(DeleteSchema)
def delete_target(args):
    target = Target.query.filter_by(id=args.get("id")).first()
    if target:
        db.session.delete(target)
        db.session.commit()
        return success()
    return error(reason="没有该记录")


@bp_target.route("/list", methods=["GET"])
@panic()
def list_target():
    targes = Target.query.order_by(desc(Target.id)).all()
    res = []
    if targes:
        for item in targes:
            res.append(item.to_dict())
    return success({
        "result": res
    })


@bp_target.route("/load", methods=["GET"])
@panic()
def load_target():
    targets = Target.query.all()
    res = []
    if not targets:
        return success({
            "result": res
        })
    for item in targets:
        if item.target and item.brokers and item.topic:
            res.append(item.to_dict())
    return success({
        "result": res
    })
