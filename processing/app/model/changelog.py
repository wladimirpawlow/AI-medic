import json
from datetime import datetime, timezone
from functools import wraps
from app.model.models import ChangeLog


def normalize_for_compare(value):
    if isinstance(value, datetime):
        return value.replace(microsecond=0, tzinfo=None)
    if isinstance(value, dict):
        return json.dumps(value, sort_keys=True)
    return value


def normalize_for_store(value):
    if isinstance(value, datetime):
        return value.isoformat()
    try:
        json.dumps(value)
        return value
    except (TypeError, ValueError):
        return str(value)


def log_changes(old_instance, new_instance, changed_by, comment=None):
    changed_at = datetime.now(timezone.utc)
    changes = []

    if old_instance is None:
        entity_type = type(new_instance).__name__
        entity_id = new_instance.id

        for field in new_instance._meta.fields.values():
            field_name = field.name
            old_value = None
            new_value = getattr(new_instance, field_name)
            if new_value not in (None, '', [], {}, set()):
                changes.append({
                    'entity_type': entity_type,
                    'entity_id': entity_id,
                    'field_name': field_name,
                    'old_value': normalize_for_store(old_value),
                    'new_value': normalize_for_store(new_value),
                    'changed_by': changed_by,
                    'changed_at': changed_at,
                    'comment': comment,
                })

    else:
        entity_type = type(old_instance).__name__
        entity_id = old_instance.id
        for field in old_instance._meta.fields.values():
            field_name = field.name
            old_value = getattr(old_instance, field_name)
            new_value = getattr(new_instance, field_name)
            if normalize_for_compare(old_value) != normalize_for_compare(new_value):
                changes.append({
                    'entity_type': entity_type,
                    'entity_id': entity_id,
                    'field_name': field_name,
                    'old_value': normalize_for_store(old_value),
                    'new_value': normalize_for_store(new_value),
                    'changed_by': changed_by,
                    'changed_at': changed_at,
                    'comment': comment,
                })

    if changes:
        ChangeLog.insert_many(changes).execute()


def clone_instance(instance):
    cls = type(instance)
    data = {
        field.name: getattr(instance, field.name)
        for field in instance._meta.sorted_fields
    }
    return cls(**data)


def get_comment(*args, **kwargs):
    result = kwargs.get('comment')
    return result


def get_changed_by(*args, **kwargs):
    result = kwargs.get('changed_by', 'system')
    return result


def log_entity_change(get_instance, changed_by_getter, comment_getter=None):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                old_instance = get_instance(*args, **kwargs)
                old_instance_clone = clone_instance(old_instance)
            except Exception as e:
                old_instance = None
                old_instance_clone = None
                # raise RuntimeError(f"log_entity_change: {e}")

            result = func(*args, **kwargs)

            try:
                new_instance = get_instance(*args, **kwargs, result=result)
            except Exception as e:
                new_instance = None
                # raise RuntimeError(f"log_entity_change {e}")

            changed_by = changed_by_getter(*args, **kwargs)
            comment = comment_getter(*args, **kwargs) if comment_getter else None

            log_changes(
                old_instance=old_instance_clone,
                new_instance=new_instance,
                changed_by=changed_by,
                comment=comment
            )

            return result
        return wrapper
    return decorator
