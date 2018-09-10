# coding:utf-8

from marshmallow import Schema, fields


class AddSchema(Schema):
    name = fields.Str(required=True)
    target = fields.Str(required=False)
    brokers = fields.Str(required=False)
    topic = fields.Str(required=False)
    interval = fields.Int(required=False)

    class Meta:
        strict = True


class UpdateSchema(Schema):
    id = fields.Int(required=True)
    name = fields.Str(required=False)
    target = fields.Str(required=False)
    brokers = fields.Str(required=False)
    topic = fields.Str(required=False)
    interval = fields.Int(required=False)

    class Meta:
        strict = True


class DeleteSchema(Schema):
    id = fields.Int(required=True)

    class Meta:
        strict = True
