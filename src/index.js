import Chart from 'chart.js/auto';

const initChart = (chartData) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            plugins: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 20,
                        right: 20,
                        bottom: 30,
                        left: 40
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 14,
                            family: 'F1Regular',
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            family: 'F1Regular',
                            size: 12,
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            family: 'F1Regular',
                            size: 12,
                        }
                    },
                    beginAtZero: true
                }
            },
            elements: {
                line: {
                    tension: 0
                },
                point: {
                    radius: 5
                }
            }
        }
    });
};

const initChart2 = (chartData) => {
    const ctx = document.getElementById('myChart2').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            plugins: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 20,
                        right: 20,
                        bottom: 30,
                        left: 40
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 14,
                            family: 'F1Regular',
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            family: 'F1Regular',
                            size: 12,
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            family: 'F1Regular',
                            size: 12,
                        }
                    },
                    beginAtZero: true
                }
            },
            elements: {
                line: {
                    tension: 0
                },
                point: {
                    radius: 5
                }
            }
        },
    });
};

window.initChart = initChart;
window.initChart2 = initChart2;