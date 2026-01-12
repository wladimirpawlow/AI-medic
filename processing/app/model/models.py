from peewee import *
from playhouse.postgres_ext import DateTimeTZField, JSONField
import peewee
db = PostgresqlDatabase(None)


class BaseModel(Model):
    class Meta:
        database = db


# setpoints models-----------------------------------------------------------

class Feature(BaseModel):
    id = UUIDField(primary_key=True)
    name = CharField(max_length=50, null=False)
    description = CharField(max_length=250, null=True)
    type = CharField(max_length=50, null=True)
    priority = CharField(max_length=50, null=True)
    default_threshold = FloatField(null=True)
    active = BooleanField(null=False)


class ThresholdSet(BaseModel):
    id = UUIDField(primary_key=True)
    name = CharField(max_length=50, null=False)
    description = CharField(max_length=250, null=True)
    group = CharField(max_length=50, null=True)
    active = BooleanField(null=False)


class Threshold(BaseModel):
    id = UUIDField(primary_key=True)
    feature_id = ForeignKeyField(Feature, null=False)
    threshold_set_id = ForeignKeyField(ThresholdSet, null=False)
    default = BooleanField(null=False)
    value = FloatField(null=False)

    deadband = FloatField(null=True)
    step_indicator = CharField(max_length=50, null=True)
    time_point_start_ms = IntegerField(null=True)
    time_point_end_ms = IntegerField(null=True)

    active = BooleanField(null=False)


# change log models-----------------------------------------------------------------------------------------------------
class ChangeLog(BaseModel):
    id = AutoField()
    entity_type = CharField(null=False)
    entity_id = UUIDField(null=False)
    field_name = CharField(null=False)
    old_value = JSONField(null=True)
    new_value = JSONField(null=True)
    changed_at = DateTimeTZField(null=False)
    changed_by = CharField(null=False)
    comment = CharField(null=True)


# --- create/drop/delete all -------------------------------------------------------------------------------------------
def create_all_tables():
    try:
        Feature.create_table()
        print("table \"Feature\" was created")
        ThresholdSet.create_table()
        print("table \"ThresholdSet\" was created")
        Threshold.create_table()
        print("table \"Threshold\" was created")

        ChangeLog.create_table()
        print("table \"ChangeLog\" was created")

    except peewee.InternalError as px:
        print(str(px))
    print("Success. All tables were created")


def drop_all_tables():
    try:
        ChangeLog.drop_table()
        print("table \"ChangeLog\" was dropped")

        Threshold.drop_table()
        print("table \"Threshold\" was dropped")
        Feature.drop_table()
        print("table \"Feature\" was dropped")
        ThresholdSet.drop_table()
        print("table \"ThresholdSet\" was dropped")
    except peewee.InternalError as px:
        print(str(px))
    print("Success. All tables were dropped")


def delete_all_tables():
    ChangeLog.delete().execute()

    Threshold.delete().execute()
    Feature.delete().execute()
    ThresholdSet.delete().execute()
    print("Success. All tables were deleted")
