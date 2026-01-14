from flask import Flask, render_template, request
from models import init_db
from routes.timer_routes import timer_bp
from routes.stats_routes import stats_bp

# アプリ起動時にデータベースとテーブルを作成する
init_db()

app = Flask(__name__)

# タイマー関連のAPI（保存処理など）をアプリに登録する
app.register_blueprint(timer_bp)
app.register_blueprint(stats_bp)

# トップページ（ルーレット画面）
@app.route('/')
def index():
    # 関数名は何でも良いですが、分かりやすく index に変更しました
    return render_template('index.html')



if __name__ == '__main__':
    # host='0.0.0.0' は外部からの接続を許可する設定です
    app.run(host='0.0.0.0', port=8080, debug=True)