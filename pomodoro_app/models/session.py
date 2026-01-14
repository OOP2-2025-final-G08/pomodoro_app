from peewee import Model, DateTimeField, IntegerField, CharField, DateField
from .db import db
import datetime

class Session(Model):
    # 勉強した日時
    created_at = DateTimeField(default=datetime.datetime.now)
    # 日付だけのデータ（集計を楽にするため追加）
    date = DateField(default=datetime.date.today)
    
    # 勉強時間（分）
    duration_minutes = IntegerField(default=0)
    # 完了したセット数（ルーレットで決まった数など）
    sets_completed = IntegerField(default=0)
    
    # 'work' か 'break' か
    category = CharField(default='work')
    # 'completed' など
    status = CharField(default='completed')

    class Meta:
        database = db