from peewee import Model, DateTimeField, IntegerField
from .db import db
import datetime

class Session(Model):
    # 勉強した日時
    created_at = DateTimeField(default=datetime.datetime.now)
    # 勉強時間（分）
    duration_minutes = IntegerField()
    # 完了したセット数（ルーレットで決まった数など）
    sets_completed = IntegerField()

    class Meta:
        database = db