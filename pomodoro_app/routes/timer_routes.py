from flask import Blueprint, render_template, request, jsonify
from models.session import Session, db
import datetime

timer_bp = Blueprint('timer', __name__)

# メモリ保持用の変数
today_goal_sets = None
last_roulette_date = None 

@timer_bp.route('/timer')
def timer_page():
    global today_goal_sets, last_roulette_date
    
    # URLパラメータからセット数を取得（ルーレット回転直後の遷移時）
    sets_param = request.args.get('sets', type=int)
    
    if sets_param is not None:
        today_goal_sets = sets_param
        last_roulette_date = datetime.date.today()
    
    return render_template('timer.html', sets=today_goal_sets)

@timer_bp.route('/api/roulette/status')
def roulette_status():
    """今日すでにルーレットを回したか判定するAPI"""
    global last_roulette_date
    today = datetime.date.today()
    already_spun = (last_roulette_date == today)
    return jsonify({"already_spun": already_spun})

@timer_bp.route('/api/goal/today', methods=['GET'])
def get_today_goal():
    """フロントエンドが現在の目標セット数を取得するためのAPI"""
    global today_goal_sets
    return jsonify({
        "status": "success",
        "target_sets": today_goal_sets if today_goal_sets is not None else 0
    })

@timer_bp.route('/api/session', methods=['POST'])
def save_session():
    """1セット完了ごとにDBに実績を記録するAPI"""
    data = request.json
    try:
        new_session = Session.create(
            duration_minutes=data.get('duration', 0),
            sets_completed=data.get('sets', 1),
            created_at=datetime.datetime.now(),
            date=datetime.date.today(),
            category='work',
            status='completed'
        )
        return jsonify({"status": "success", "id": new_session.id})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500