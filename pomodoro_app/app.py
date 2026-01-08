from flask import Flask, render_template

app = Flask(__name__)

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

if __name__ == '__main__':
    # host='0.0.0.0' は外部からの接続を許可する設定です
    app.run(host='0.0.0.0', port=8080, debug=True)