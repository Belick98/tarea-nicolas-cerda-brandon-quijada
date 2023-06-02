document.addEventListener('DOMContentLoaded', function() {
  const indicatorSelect = document.getElementById('indicatorSelect');
  const indicatorInfo = document.getElementById('indicatorInfo');
  const indicatorChart = document.getElementById('indicatorChart').getContext('2d');
  let chart;

  // Obtener los tipos de indicadores disponibles
  axios.get('https://mindicador.cl/api')
    .then(function(response) {
      const indicators = response.data;
      for (const key in indicators) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = indicators[key].nombre;
        indicatorSelect.appendChild(option);
      }
    })
    .catch(function(error) {
      console.log(error);
    });

  // Obtener la información del indicador seleccionado
  indicatorSelect.addEventListener('change', function() {
    const selectedIndicator = indicatorSelect.value;
    axios.get(`https://mindicador.cl/api/${selectedIndicator}`)
      .then(function(response) {
        const indicatorData = response.data;
        const latestData = indicatorData.serie[0];

        const html = `
          <h3>${indicatorData.nombre}</h3>
          <p>Valor: ${latestData.valor}</p>
          <p>Fecha: ${latestData.fecha}</p>
          <p>Unidad de medida: ${indicatorData.unidad_medida}</p>
        `;
        indicatorInfo.innerHTML = html;

        const dates = [];
        const values = [];
        for (const data of indicatorData.serie) {
          dates.push(data.fecha);
          values.push(data.valor);
        }

        if (chart) {
          chart.destroy();
        }

        chart = new Chart(indicatorChart, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [{
              label: indicatorData.nombre,
              data: values,
              backgroundColor: 'rgba(0, 123, 255, 0.3)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                display: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)', // Color de la línea de las coordenadas x
                  borderColor: 'rgba(0, 0, 0, 0.1)' // Color del borde de las coordenadas x
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 10,
                  color: 'rgba(0, 0, 0, 0.5)', // Color de las coordenadas x
                  font: {
                    size: 12
                  }
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)' // Color de las coordenadas y
                },
                ticks: {
                  color: 'rgba(0, 0, 0, 0.5)', // Color de las coordenadas y
                  font: {
                    size: 12
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                labels: {
                  font: {
                    size: 14
                  }
                }
              }
            }
          }
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  });
});
