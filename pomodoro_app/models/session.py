from peewee import Model, DateTimeField, IntegerField, CharField, DateField, SqliteDatabase
from .db import db
import datetime

class Session(Model):
    created_at = DateTimeField(default=datetime.datetime.now)
    date = DateField(default=datetime.date.today)
    duration_minutes = IntegerField(default=0)
    sets_completed = IntegerField(default=0)
    category = CharField(default='work')
    status = CharField(default='completed')

    class Meta:
        database = db