from marshmallow import Schema, fields


class FeatureSchema(Schema):
    name = fields.String(required=True)
    description = fields.String(required=False, allow_none=True)
    type = fields.String(required=False, allow_none=True)
    priority = fields.String(required=False, allow_none=True)
    default_threshold = fields.Float(required=False, allow_none=True)
    active = fields.Boolean(required=True)


class FeatureResponseSchema(Schema):
    id = fields.UUID()
    name = fields.String()
    description = fields.String()
    type = fields.String()
    priority = fields.String()
    default_threshold = fields.Float()
    active = fields.Boolean()



