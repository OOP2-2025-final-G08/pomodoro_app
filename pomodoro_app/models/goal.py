from peewee import Model, IntegerField, DateField
from .db import db
import datetime

class Goal(Model):
    # いつの目標か
    date = DateField(default=datetime.date.today)
    # その日の目標セット数（黄色い線の値）
    target_count = IntegerField(default=4)

    class Meta:
        database = db