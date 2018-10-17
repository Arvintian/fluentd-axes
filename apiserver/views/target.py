# -*- coding:utf-8 -*-

from flask import Blueprint, request
from sqlalchemy import desc
from apiserver.repositorys.props import auth, success, error, panic, m2dict
from apiserver.types.target import AddSchema, UpdateSchema, DeleteSchema
from apiserver.models import Target
from apiserver import db

bp_target = Blueprint("bp_target", __name__)


@bp_target.route("/add", methods=["POST"])
@panic(AddSchema)
def add_target(args):
    target = Target(name=args.get("name"))
    for k, v in args.items():
        target.__setattr__(k, v)
    db.session.add(target)
    db.session.commit()
    return success({
        "result": m2dict(target)
    })


@bp_target.route("/update", methods=["POST"])
@panic(UpdateSchema)
def update_target(args):
    target = Target.query.filter_by(id=args.get("id")).first()
    if not target:
        return error(reason="没有该记录")
    for k, v in args.items():
        target.__setattr__(k, v)
    db.session.commit()
    return success({
        "result": m2dict(target)
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
    targets = Target.query.order_by(desc(Target.id)).all()
    res = []
    if targets:
        for item in targets:
            res.append(m2dict(item))
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
        enables = {"enable": "false"}
        enables.update(item.kafka_config())
        enables.update(item.sls_config())
        enables.update(item.buffer_config())
        if item.enable_kafka or item.enable_sls:
            enables.update({"enable": "true"})
        res.append(enables)
    return success({
        "result": res
    })
