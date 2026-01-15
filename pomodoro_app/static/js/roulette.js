document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('rouletteCanvas');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spinBtn');
    const resultArea = document.getElementById('resultArea');
    const resultText = document.getElementById('resultText');
    const goToTimerBtn = document.getElementById('goToTimerBtn');

    const items = [
        { label: '1セット', value: 1, color: '#3498db' },
        { label: '2セット', value: 2, color: '#2ecc71' },
        { label: '3セット', value: 3, color: '#f1c40f' },
        { label: '4セット', value: 4, color: '#e74c3c' }
    ];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    let currentAngle = 0;
    let isSpinning = false;
    let spinVelocity = 0;

    function drawRoulette() {
        const arc = 2 * Math.PI / items.length;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        items.forEach((item, i) => {
            const angle = currentAngle + i * arc;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, angle, angle + arc);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = item.color;
            ctx.fill();
            ctx.stroke();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 20px Arial";
            ctx.fillText(item.label, radius - 30, 10);
            ctx.restore();
        });
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.stroke();
    }

    function animate() {
        if (!isSpinning) return;
        spinVelocity *= 0.985;
        currentAngle += spinVelocity;

        if (spinVelocity < 0.002) {
            isSpinning = false;
            spinVelocity = 0;
            showResult();
        }

        drawRoulette();
        if (isSpinning) requestAnimationFrame(animate);
    }

    function showResult() {
        const arc = 2 * Math.PI / items.length;
        const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const index = Math.floor((2 * Math.PI - (normalizedAngle + Math.PI / 2) % (2 * Math.PI)) / arc) % items.length;
        const finalIndex = (index + items.length) % items.length;
        const result = items[finalIndex];

        resultText.textContent = result.value;
        resultArea.style.display = 'block';

        // ★重要: 自前でボタンを有効化(disabled=false)せず、HTML側のロック関数を呼ぶ
        if (window.onRouletteFinished) {
            window.onRouletteFinished(result.value);
        }
    }

    // グローバルに公開（index.htmlから呼べるようにする）
    window.startSpin = function() {
        if (isSpinning) return;
        isSpinning = true;
        resultArea.style.display = 'none';
        spinVelocity = Math.random() * 0.5 + 0.3;
        animate();
    };

    spinBtn.addEventListener('click', window.startSpin);
    drawRoulette();
});