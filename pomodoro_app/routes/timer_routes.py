from flask import Blueprint, render_template, request, jsonify # requestを追加
from models.session import Session
import datetime

timer_bp = Blueprint('timer', __name__)

# タイマー画面を表示するルート（app.pyからこっちに引っ越し！）
@timer_bp.route('/timer')
def timer_page(): # 関数名がぶつからないように timer_page にしておくと安全！
    sets = request.args.get('sets', default=1, type=int)
    return render_template('timer.html', sets=sets)

# API: セッション保存（JS側に合わせて /api/session に修正）
@timer_bp.route('/api/session', methods=['POST'])
def save_session():
    data = request.json
    new_session = Session.create(
        duration_minutes=data.get('duration', 0),
        sets_completed=data.get('sets', 0),
        created_at=datetime.datetime.now()
    )
    return jsonify({"status": "success", "id": new_session.id})

# API: 今日の目標
@timer_bp.route('/api/goal/today', methods=['GET'])
def get_today_goal():
    return jsonify({"daily_target_minutes": 60, "status": "success"})