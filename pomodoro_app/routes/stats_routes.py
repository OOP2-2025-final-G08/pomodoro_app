from flask import Blueprint, render_template, jsonify
from models.session import Session, db
from peewee import fn
import datetime
import calendar

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/stats')
def stats_page():
    now = datetime.datetime.now()
    return render_template('stats.html', year=now.year, month=now.month)

@stats_bp.route('/api/stats/chart-data')
def get_chart_data():
    # timer_routes で保持している「今日の目標数」を読み込む
    from .timer_routes import today_goal_sets
    
    today = datetime.date.today()
    year = today.year
    month = today.month

    # 1. カレンダーのラベル作成 (1日〜末日)
    last_day = calendar.monthrange(year, month)[1]
    labels = [f"{i}日" for i in range(1, last_day + 1)]

    # 2. 実績データ (完了セット数) の集計
    completed_data = [0] * last_day
    sessions = (Session
                .select(
                    Session.date,
                    fn.SUM(Session.sets_completed).alias('total')
                )
                .where(
                    (Session.date >= datetime.date(year, month, 1)) &
                    (Session.date <= datetime.date(year, month, last_day))
                )
                .group_by(Session.date))

    for s in sessions:
        day_index = s.date.day - 1
        completed_data[day_index] = int(s.total)

    # 3. 目標データ (黄色い線) の作成
    # 全て 0 で初期化し、今日の日付の場所だけルーレットの値をいれる
    targets_data = [0] * last_day
    
    current_day_index = today.day - 1
    if today_goal_sets is not None:
        targets_data[current_day_index] = today_goal_sets

    return jsonify({
        "status": "success",
        "labels": labels,
        "completed": completed_data,
        "targets": targets_data
    })