from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from app.model.exeptions import SetpointsOperationError
from app.manage_app.logging import processes_logger
from app.api.setpoints.feature.schemas import (
    FeatureSchema, FeatureResponseSchema
)
from app.model.setpoints.feature import (
    add_feature, get_feature_list, get_feature_by_id, modify_feature
)
from app.api.shemas import AmountQuerySchema, CommentQuerySchema

blp = Blueprint(name="setpoints/features",
                import_name="features",
                url_prefix="/api/processing/setpoints/features",
                description="Feature operations")


@blp.route("")
class FeatureResource(MethodView):
    @blp.arguments(CommentQuerySchema, location="query")
    @blp.arguments(FeatureSchema)
    def post(self, query_args, data):
        """Create new feature"""
        try:
            # user_login = request.jwt_payload["sub"]
            feature_id = add_feature(
                name=data.get("name"),
                description=data.get("description"),
                type=data.get("type"),
                priority=data.get("priority"),
                default_threshold=data.get("default_threshold"),
                active=data.get("active"),
                comment=query_args.get("comment"),
                # changed_by=user_login,
            )
            return {"feature_id": str(feature_id)}, 201
        except SetpointsOperationError as e:
            processes_logger.error(str(e))
            abort(400, message=str(e))


@blp.route("/amount")
class FeatureAmountResource(MethodView):
    @blp.arguments(AmountQuerySchema, location="query")
    @blp.response(200, FeatureResponseSchema(many=True))
    def get(self, args):
        """Return selected amount of features"""
        try:
            amount = args.get("amount")
            return get_feature_list(amount)
        except SetpointsOperationError as e:
            processes_logger.error(str(e))
            abort(500, message=str(e))


@blp.route("/<uuid:feature_id>")
class FeatureByIDResource(MethodView):
    @blp.response(200, FeatureResponseSchema)
    def get(self, feature_id):
        """Return feature by ID"""
        try:
            result = get_feature_by_id(feature_id)
            return result
        except SetpointsOperationError as e:
            processes_logger.error(str(e))
            abort(500, message=str(e))


# @blp.route("")
# class FeatureResource(MethodView):
#     @blp.arguments(CommentQuerySchema, location="query")
#     @blp.arguments(FeatureSchema)
#     def post(self, query_args, data):
#         """Create new feature"""


@blp.route("/<uuid:feature_id>/settings")
class FeatureModifyResource(MethodView):
    @blp.response(200, FeatureResponseSchema)
    @blp.arguments(FeatureSchema)
    @blp.arguments(CommentQuerySchema, location="query")
    def put(self, data, query_args, feature_id):
        """Modify selected feature"""
        try:
            # user_login = request.jwt_payload["sub"]
            modify_feature(
                item_id=feature_id,
                name=data.get("name"),
                description=data.get("description"),
                type=data.get("type"),
                priority=data.get("priority"),
                default_threshold=data.get("default_threshold"),
                active=data.get("active"),
                comment=query_args.get("comment"),
                # changed_by=user_login,
            )
            result = get_feature_by_id(feature_id)
            return result
        except SetpointsOperationError as e:
            processes_logger.error(str(e))
            abort(400, message=str(e))
