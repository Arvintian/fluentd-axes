from marshmallow import Schema, fields


class UpdateSchema(Schema):
    brokers = fields.Str(required=True)
    topic = fields.Str(required=True)
    interval = fields.Int(required=True)

    class Meta:
        strict = True
