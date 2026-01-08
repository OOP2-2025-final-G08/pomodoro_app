document.addEventListener('DOMContentLoaded', function() {
    // キャンバス要素を取得
    const ctx = document.getElementById('statsChart');
    
    if (ctx) {
        // 新しく作った専用APIからデータを取得
        fetch('/api/stats/chart-data')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                new Chart(ctx.getContext('2d'), {
                    type: 'bar', // 基本は棒グラフ
                    data: {
                        labels: data.labels,
                        datasets: [
                            {
                                label: '完了数',
                                data: data.completed,
                                backgroundColor: '#3498db',
                                order: 2
                            },
                            {
                                label: '目標数',
                                data: data.targets,
                                type: 'line', // 目標は折れ線で表示
                                borderColor: '#FFD700',
                                borderWidth: 3,
                                pointBackgroundColor: '#FFD700',
                                pointRadius: 4,
                                fill: false,
                                tension: 0.1,
                                order: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            title: {
                                display: true,
                                text: '今月の目標と実績'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { stepSize: 1 }
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching chart data:', error);
            });
    }
});