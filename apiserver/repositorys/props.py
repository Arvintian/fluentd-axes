# -*- coding:utf-8 -*-

from flask import request, g
from flask import jsonify
import functools
import traceback
from webargs.flaskparser import FlaskParser


def auth(f):
    """权限校验"""

    @functools.wraps(f)
    def warpper(*args, **kwargs):
        head_session_id = request.headers.get('session_id', None) if request.headers.get("session_id", None) else request.headers.get("session", None)
        query_session_id = request.args.get("session_id", None) if request.args.get("session_id", None) else request.args.get("session", None)
        if head_session_id:
            g.session_id = head_session_id
            return f(*args, **kwargs)
        elif query_session_id:
            g.session_id = query_session_id
            return f(*args, **kwargs)
        else:
            return jsonify({
                "status": "error",
                "reason": "session id is None"
            })

    return warpper


parser = FlaskParser()


class ValidateException(Exception):
    pass


@parser.error_handler
def handle_error(error, req, schema):
    raise ValidateException(error.messages)


def panic(schema=None):
    """异常"""
    def outter(func):
        if schema:
            @parser.use_args(schema)
            def run_func(*args, **kwargs):
                return func(*args, **kwargs)
        else:
            run_func = func

        @functools.wraps(func)
        def warpper(*args, **kwargs):
            try:
                return run_func(*args, **kwargs)
            except ValidateException as e:
                return error(reason="{}".format(e))
            except Exception as e:
                traceback.print_exc()
                return error(reason="{}".format(e))
        return warpper
    return outter


def success(r=None):
    s = {
        "status": "ok"
    }
    if r:
        s.update(r)
    return jsonify(s)


def error(r=None, reason=None):
    s = {
        "status": "error",
        "reason": reason
    }
    if r:
        s.update(r)
    return jsonify(s)
