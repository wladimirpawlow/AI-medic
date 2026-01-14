import uuid
import peewee
from typing import List, Dict
from app.model.models import Feature
from app.model.exeptions import SetpointsOperationError
from app.model.changelog import log_entity_change, get_comment, get_changed_by


def _get_instance(*args, **kwargs):
    try:
        result = kwargs.get('result')
        if isinstance(result, dict) and 'id' in result:
            return Feature.get(Feature.id == result['id'])
        if 'item_id' in kwargs:
            return Feature.get(Feature.id == kwargs['item_id'])
        else:
            return Feature.get(Feature.id == result)
    except Exception:
        raise ValueError("Entity ID was not defined")


def _dict_for_data(data) -> List[Dict]:
    data_dict = []
    for point in data:
        data_dict.append({
            'id':                   str(point.id),
            'name':                 point.name,
            'description':          point.description,
            'type':                 point.type,
            'priority':             point.priority,
            'default_threshold':    point.default_threshold,
            'active':               point.active,
        })
    return data_dict


# ---------------------------------------------------------------------------------------------------------------------


@log_entity_change(
    get_instance=_get_instance,
    changed_by_getter=get_changed_by,
    comment_getter=get_comment)
def add_feature(name,
                description=None,
                type=None,
                priority=None,
                default_threshold=None,
                active=True,
                changed_by='system',
                comment=None
                ):

    u = uuid.uuid4()
    try:
        row = Feature(
            id=u,
            name=name,
            description=description,
            type=type,
            priority=priority,
            default_threshold=default_threshold,
            active=active,
        )
        row.save(force_insert=True)
        return u
    except peewee.PeeweeException as px:
        raise SetpointsOperationError(message=str(px),
                                      item_type=Feature.__name__,
                                      data={"name": name,
                                            "description": description,
                                            'type': type,
                                            'priority': priority,
                                            'default_threshold': default_threshold,
                                            "active": active})


@log_entity_change(
    get_instance=_get_instance,
    changed_by_getter=get_changed_by,
    comment_getter=get_comment)
def modify_feature(item_id,
                   name,
                   description=None,
                   type=None,
                   priority=None,
                   default_threshold=None,
                   active=True,
                   changed_by='system',
                   comment=None
                   ):

    try:
        item = Feature.get(Feature.id == item_id)
        item.name = name
        item.description = description
        item.type = type
        item.priority = priority
        item.default_threshold = default_threshold
        item.active = active

        item.save()
        result = get_feature_by_id(item_id)
        return result
    except peewee.DoesNotExist:
        raise SetpointsOperationError(message=f'Error: {item_id} does not exist',
                                      item_type=Feature.__name__)
    except peewee.PeeweeException as px:
        raise SetpointsOperationError(message=str(px),
                                      item_type=Feature.__name__)


def get_feature_list(amount=None):
    try:
        data = Feature.select().limit(amount)
        result = _dict_for_data(data)
        return result
    except peewee.PeeweeException as px:
        raise SetpointsOperationError(message=str(px),
                                      item_type=Feature.__name__)


def get_feature_by_id(item_id):
    try:
        data = Feature.select().where(Feature.id == item_id)
        result = _dict_for_data(data)[0] if _dict_for_data(data) else {}
        return result
    except peewee.PeeweeException as px:
        raise SetpointsOperationError(message=str(px),
                                      item_type=Feature.__name__)

