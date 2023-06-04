document.addEventListener('DOMContentLoaded', function() {
  var currencySelector = document.getElementById('currency');
  var yearSelector = document.getElementById('year');
  var dateInput = document.getElementById('date');
  var searchButton = document.getElementById('search-btn');

  searchButton.addEventListener('click', fetchData);

  function fetchData() {
    var currency = currencySelector.value;
    var year = yearSelector.value;

    // Obtener el último día del mes seleccionado
    var lastDay = new Date(year, dateInput.value.split('-')[1], 0).getDate();

    dateInput.setAttribute('max', year + '-12-' + lastDay);

    var url = 'https://mindicador.cl/api/' + currency + '/' + year;

    if (dateInput.value) {
      url += '/' + formatDate(dateInput.value);
    }

    axios.get(url)
      .then(function(response) {
        var data = response.data;
        var labels = [];
        var values = [];

        if (dateInput.value) {
          labels.push(formatDate(dateInput.value));
          values.push(data.serie[0].valor);
        } else {
          for (var i = 0; i < data.serie.length; i++) {
            var item = data.serie[i];
            labels.push(formatDate(item.fecha));
            values.push(item.valor);
          }
        }

        renderChart(labels, values);
        renderTable(data.serie);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function renderChart(labels, values) {
    var ctx = document.getElementById('chart').getContext('2d');

    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Valor',
          data: values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Fecha'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Valor'
            }
          }
        }
      }
    });
  }

  function renderTable(data) {
    var tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var row = document.createElement('tr');
      var currencyCell = document.createElement('td');
      var valueCell = document.createElement('td');
      var dateCell = document.createElement('td');

      currencyCell.textContent = currencySelector.options[currencySelector.selectedIndex].text;
      valueCell.textContent = item.valor;
      dateCell.textContent = formatDate(item.fecha, false);

      row.appendChild(currencyCell);
      row.appendChild(valueCell);
      row.appendChild(dateCell);

      tableBody.appendChild(row);
    }
  }

  function formatDate(date, includeWeekday) {
    var parts = date.split('-');
    var formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];

    return formattedDate;
  }

  // Obtener las monedas disponibles de la API
  axios.get('https://mindicador.cl/api')
    .then(function(response) {
      var currencies = response.data;

      for (var currency in currencies) {
        var option = document.createElement('option');
        option.value = currency;
        option.textContent = currencies[currency].nombre;
        currencySelector.appendChild(option);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
});
