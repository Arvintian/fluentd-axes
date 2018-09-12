# coding:utf-8

from marshmallow import Schema, fields


class _updateFields(object):
    target = fields.Str(required=False)
    brokers = fields.Str(required=False)
    topic = fields.Str(required=False)
    interval = fields.Int(required=False)
    sls_access_key_id = fields.String(required=False)
    sls_access_key_secret = fields.String(required=False)
    sls_project = fields.String(required=False)
    sls_region_endpoint = fields.String(required=False)
    sls_logstore = fields.String(required=False)
    sls_need_create_logstore = fields.Boolean(required=False)


class AddSchema(Schema, _updateFields):
    name = fields.Str(required=True)

    class Meta:
        strict = True


class UpdateSchema(Schema, _updateFields):
    id = fields.Int(required=True)
    name = fields.Str(required=False)

    class Meta:
        strict = True


class DeleteSchema(Schema):
    id = fields.Int(required=True)

    class Meta:
        strict = True
