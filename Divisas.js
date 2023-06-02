var ctx = document.getElementById('grafico').getContext('2d');


fetch('https://mindicador.cl/api/{tipo_indicador}/{dd-mm-yyyy}')
  .then(response => response.json())
  .then(data => {
    // Procesar los datos recibidos de la API y extraer la información necesaria
    var years = data.years;
    var prices = data.prices;

    // Configurar y dibujar el gráfico
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'Precios',
          data: prices,
          borderColor: 'blue',
          backgroundColor: 'transparent'
        }]
      },
      options: {}
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos de la API', error);
  });
