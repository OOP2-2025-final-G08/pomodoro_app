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

# 2. グラフ用データを返す専用API
@stats_bp.route('/api/stats/chart-data')
def get_stats_chart_data():
    today = date.today()
    year = today.year
    month = today.month
    
    # 今月の日数を取得
    _, last_day = calendar.monthrange(year, month)
    
    first_date = date(year, month, 1)
    last_date = date(year, month, last_day)
    
    days = list(range(1, last_day + 1))
    targets = [0] * last_day
    completed = [0] * last_day
    
    # 目標データの取得
    goals = Goal.select().where(
        (Goal.date >= first_date) & (Goal.date <= last_date)
    )
    for g in goals:
        targets[g.date.day - 1] = g.target_count
        
    # 完了データの取得
    sessions = Session.select().where(
        (Session.date >= first_date) & 
        (Session.date <= last_date) &
        (Session.status == 'completed') &
        (Session.category == 'work')
    )
    for s in sessions:
        completed[s.date.day - 1] += 1
        
    return jsonify({
        'labels': [f'{d}日' for d in days],
        'targets': targets,
        'completed': completed
    })