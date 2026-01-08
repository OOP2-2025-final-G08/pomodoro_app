from peewee import Model, IntegerField
from .db import db

class Goal(Model):
    # 1日の目標勉強時間（分）
    daily_target_minutes = IntegerField(default=60)

    class Meta:
        database = db