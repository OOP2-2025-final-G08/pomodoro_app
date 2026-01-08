from flask import Flask, render_template, request
from models import init_db
from routes.timer_routes import timer_bp

# アプリ起動時にデータベースとテーブルを作成する
init_db()

app = Flask(__name__)

# タイマー関連のAPI（保存処理など）をアプリに登録する
app.register_blueprint(timer_bp)

# トップページ（ルーレット画面）
@app.route('/')
def index():
    # 関数名は何でも良いですが、分かりやすく index に変更しました
    return render_template('index.html')

# --- 【追加】タイマーページ ---
@app.route('/timer')
def timer():
    # これにより /timer というURLにアクセスすると timer.html が表示されます
    return render_template('timer.html')

@app.route('/timer')
def timer():
    # URLの後ろの ?sets=4 を受け取る。なければ 1 にする
    sets = request.args.get('sets', default=1, type=int)
    # HTML側に sets という名前でデータを送る
    return render_template('timer.html', sets=sets)

if __name__ == '__main__':
    # host='0.0.0.0' は外部からの接続を許可する設定です
    app.run(host='0.0.0.0', port=8080, debug=True)