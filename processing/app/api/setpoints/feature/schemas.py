from marshmallow import Schema, fields


class FeatureSchema(Schema):
    name = fields.String(required=True)
    description = fields.String(required=False)
    type = fields.String(required=False)
    priority = fields.String(required=False)
    default_threshold = fields.Float(required=False)
    active = fields.Boolean(required=True)


class FeatureResponseSchema(Schema):
    id = fields.UUID()
    name = fields.String()
    description = fields.String()
    type = fields.String()
    priority = fields.String()
    default_threshold = fields.Float()
    active = fields.Boolean()



