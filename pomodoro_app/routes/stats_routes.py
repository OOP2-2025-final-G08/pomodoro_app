from flask import Blueprint, render_template, jsonify
from models.goal import Goal
from models.session import Session
from datetime import date
import calendar

# Blueprint名を 'stats' にして独立させます
stats_bp = Blueprint('stats', __name__)

# 1. 統計ページを表示するルート
@stats_bp.route('/stats')
def stats_page():
    today = date.today()
    # HTMLに year と month を渡す
    return render_template('stats.html', year=today.year, month=today.month)

# 2. グラフ用データを作るAPI（安全装置付き）
@stats_bp.route('/api/stats/chart-data')
def get_stats_chart_data():
    today = date.today()
    year = today.year
    month = today.month
    
    # 月の最後の日付を取得
    _, last_day = calendar.monthrange(year, month)
    
    # 1日から月末までのリスト
    days = list(range(1, last_day + 1))
    
    # データを入れる箱（最初は全部 0）
    targets = [0] * last_day
    completed = [0] * last_day
    
    # --- 安全装置ここから ---
    # データベースが壊れていても、エラーにせず「0」のままグラフを出す
    
    try:
        # 目標データの取得に挑戦
        goals = Goal.select().where(
            (Goal.date.year == year) & (Goal.date.month == month)
        )
        for g in goals:
            day_idx = g.date.day - 1
            if 0 <= day_idx < last_day:
                targets[day_idx] = g.target_count
    except Exception:
        # 失敗したら何もしない（0のまま）
        pass

    try:
        # 実績データの取得に挑戦
        sessions = Session.select().where(
            (Session.created_at.year == year) & 
            (Session.created_at.month == month)
        )
        for s in sessions:
            day_idx = s.created_at.day - 1
            if 0 <= day_idx < last_day:
                completed[day_idx] += s.sets_completed
    except Exception:
        # 失敗したら何もしない（0のまま）
        pass
    # --- 安全装置ここまで ---
    
    return jsonify({
        'labels': [f'{d}日' for d in days],
        'targets': targets,
        'completed': completed
    })