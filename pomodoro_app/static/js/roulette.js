document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('rouletteCanvas');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spinBtn');
    const resultArea = document.getElementById('resultArea');
    const resultText = document.getElementById('resultText');
    const goToTimerBtn = document.getElementById('goToTimerBtn');

    // ルーレットの設定（1セット〜4セット）
    const items = [
        { label: '1セット', value: 1, color: '#3498db' }, // 青
        { label: '2セット', value: 2, color: '#2ecc71' }, // 緑
        { label: '3セット', value: 3, color: '#f1c40f' }, // 黄
        { label: '4セット', value: 4, color: '#e74c3c' }  // 赤
    ];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10; // 余白を少し取る

    let currentAngle = 0; // 現在の角度
    let isSpinning = false; // 回転中フラグ
    let spinVelocity = 0; // 回転速度

    // 円を描画する関数
    function drawRoulette() {
        const arc = 2 * Math.PI / items.length; // 1区画の角度

        // 背景クリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 各セクターの描画
        items.forEach((item, i) => {
            const angle = currentAngle + i * arc;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, angle, angle + arc);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = item.color;
            ctx.fill();
            ctx.stroke();

            // テキストの描画
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 20px Arial";
            ctx.fillText(item.label, radius - 30, 10);
            ctx.restore();
        });
        
        // 中心円（装飾）
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.stroke();
    }

    // 回転アニメーション関数
    function animate() {
        if (!isSpinning) return;

        // 速度を減衰させる（摩擦）
        spinVelocity *= 0.985;
        currentAngle += spinVelocity;

        // 速度が十分小さくなったら停止
        if (spinVelocity < 0.002) {
            isSpinning = false;
            spinVelocity = 0;
            showResult();
        }

        drawRoulette();
        
        if (isSpinning) {
            requestAnimationFrame(animate);
        }
    }

    // 結果を判定して表示する関数
    function showResult() {
        const arc = 2 * Math.PI / items.length;
        // 現在の角度を 0〜2π に正規化
        const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        
        // 矢印（上部 -90度 = 3/2π）が指しているセクターを計算
        // Canvasの0度は右側なので、上(-π/2)の位置にあるセクターを逆算する
        // インデックス計算: 全体から (現在の角度 + 90度分) を引いて区画で割るイメージ
        const index = Math.floor((2 * Math.PI - (normalizedAngle + Math.PI / 2) % (2 * Math.PI)) / arc) % items.length;
        
        // マイナス補正
        const finalIndex = (index + items.length) % items.length;
        const result = items[finalIndex];

        // 結果表示
        resultText.textContent = result.value;
        resultArea.style.display = 'block';
        spinBtn.disabled = false;

        // タイマー画面への遷移ボタンにパラメータをセット（例: /timer?sets=3）
        // ※実際にはRole 1の人が作るURLに合わせて調整してください
        goToTimerBtn.onclick = function() {
            window.location.href = `/timer?sets=${result.value}`;
        };
    }

    // ボタンクリックイベント
    spinBtn.addEventListener('click', function () {
        if (isSpinning) return;

        isSpinning = true;
        resultArea.style.display = 'none'; // 結果を隠す
        spinBtn.disabled = true;

        // 初速をランダムに設定（結果をランダムにするため）
        spinVelocity = Math.random() * 0.5 + 0.3; // 0.3 〜 0.8 の強さ
        
        animate();
    });

    // 初期描画
    drawRoulette();
});