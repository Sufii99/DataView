document.addEventListener('turbo:load', function () {
    const chartTypeSelect = document.getElementById('chartType');
    const chartContainer = document.getElementById('chartContainer');
  
    let myChart = null;
  
    const chartData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      datasets: [{
        label: 'Ventas 2025',
        data: [10, 20, 30, 40, 50],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    };
  
    function renderChart(type) {
      // Limpia completamente el contenido previo
      chartContainer.innerHTML = '';
  
      // Crea un nuevo canvas cada vez
      const canvas = document.createElement('canvas');
      canvas.id = 'myChart';
      canvas.width = 400;
      canvas.height = 300;
      canvas.style.maxWidth = '100%';
      canvas.style.height = 'auto';
  
      chartContainer.appendChild(canvas);
  
      const ctx = canvas.getContext('2d');
  
      myChart = new Chart(ctx, {
        type: type,
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1000,           // Duración de la animación en milisegundos
              easing: 'easeOutQuad'     // Tipo de transición para suavizar la animación
            },
            scales: type === 'bar' || type === 'line' ? {
              y: {
                beginAtZero: true
              }
            } : {}
        }          
      });
    }
  
    chartTypeSelect.addEventListener('change', function () {
      if (myChart) {
        myChart.destroy();
      }
      renderChart(this.value);
    });
  
    // Carga inicial
    renderChart(chartTypeSelect.value);
  });
  