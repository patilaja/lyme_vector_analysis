
var xlabels = [];
var ytemps = [];
var ymast = [];

chartIt();

async function chartIt() {
  var ctx = document.getElementById('timeSeries').getContext('2d');
  await getData();
  console.log(xlabels);
  console.log(ytemps);
  console.log(ymast);

  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xlabels,
      datasets: [{
        label: 'NJ Cases Per 100 K',
        data: ytemps,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Mast Years',
        data: ymast,
        type: 'bar'
      }]
    },
    options: {

      annotation: {
        annotations: [
          {
            drawTime: "afterDatasetsDraw",
            type: "line",
            mode: "vertical",
            scaleID: "x-axis-0",
            value: xlabels[5],
            borderColor: "black",
            borderWidth: 5,
            label: {
              backgroundColor: "red",
              content: "Test Label",
              enabled: true
            }
          }
        ]},
            scales: {
            yAxes: [{
              ticks: {
                callback: function (value, index, values) {
                  return value + 'k';
                }
              }
            }]
          },
          get scales() {
            return this._scales;
          },
          set scales(value) {
            this._scales = value;
          },

      }

    });




  async function getData() {
    var response = await fetch('/incidentYears');
    var data = await response.json();
    mastYears = [2007,2010,2015,2017];

    for (var i=0; i < data.yearCase.length; i++) {
      year = data.yearCase[i][0];
      cases = data.yearCase[i][1];
      ytemps.push(cases);
      xlabels.push(year);
      if (mastYears.includes(year)) {
        yearValue = 60;
      }
      else {
        yearValue = 0;
      }
      ymast.push(yearValue);
    };
  }
}

// new Chart(chartIt, {
//      type: 'line',
//      data: chartData(response.data),
//      label: 'Progress',
//      options: options,
//      lineAtIndex: [2,4,8],
//  })
