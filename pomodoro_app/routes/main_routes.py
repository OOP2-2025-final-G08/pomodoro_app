from flask import Blueprint, render_template

# Blueprintの作成（名前: main）
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """トップページ（ルーレット画面）を表示する"""
    return render_template('index.html')