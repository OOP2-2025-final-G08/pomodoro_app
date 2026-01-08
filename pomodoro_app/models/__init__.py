from .db import db
from .session import Session
from .goal import Goal

# モデルのリストを作っておくと管理が楽！
models = [Session, Goal]

def init_db():
    """データベースの接続とテーブル作成を行う関数"""
    db.connect()
    # テーブルが存在しない場合だけ新規作成してくれる
    db.create_tables(models, safe=True)
    db.close()