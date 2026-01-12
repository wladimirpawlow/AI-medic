from marshmallow import Schema, fields


class AmountQuerySchema(Schema):
    amount = fields.Integer(required=False)


class CommentQuerySchema(Schema):
    comment = fields.String(required=False)


class AmountCommentQuerySchema(Schema):
    amount = fields.Integer(required=False)
    comment = fields.String(required=False)


class OptionValuesSchema(Schema):
    name = fields.String(required=False)
    value = fields.String(required=False)


class OptionSchema(Schema):
    name = fields.String(required=False)
    description = fields.String(required=False)
    required = fields.Boolean(required=False)
    type = fields.String(required=False)
    min = fields.Float(required=False)
    max = fields.Float(required=False)
