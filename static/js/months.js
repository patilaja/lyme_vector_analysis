
d3.json("/incidentMonths", function (err, monthData) {

var values = monthData.map(d => d.cases);
var months = monthData.map(d => d.month);


var data = [{
  type: "pie",
  values: values,
  labels:  months,
  hoverinfo: "label",
  textposition: "outside",
  automargin: true
}]

var layout = {
  height: 350,
  width: 350,
  margin: {"t": 0, "b": 0, "l": 0, "r": 0},
  showlegend: false
  }
Plotly.newPlot('incidentPie', data, layout)
});
