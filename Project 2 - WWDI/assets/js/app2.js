Plotly.d3.csv("./assets/Resources/final3.csv", function(err, rows){

  function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
  }

  var headerNames = Plotly.d3.keys(rows[0]);

  var headerValues = [];
  var cellValues = [];
  for (i = 0; i < headerNames.length; i++) {
    headerValue = [headerNames[i]];
    headerValues[i] = headerValue;
    cellValue = unpack(rows, headerNames[i]);
    cellValues[i] = cellValue;
  }

var data = [{
  type: 'table',
  columnwidth: [1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000],
  columnorder: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
  header: {
    values: headerValues,
    align: "center",
    line: {width: 1, color: 'rgb(50, 50, 50)'},
    fill: {color: ['rgb(235, 100, 230)']},
    font: {family: "Arial", size: 8, color: "white"}
  },
  cells: {
    values: cellValues,
    align: ["center", "center"],
    line: {color: "black", width: 1},
    fill: {color: ['rgba(228, 222, 249, 0.65)','rgb(235, 193, 238)', 'rgba(228, 222, 249, 0.65)']},
    font: {family: "Arial", size: 8, color: ["black"]}
  }
}]

var layout = {
  title: "Energy Use Data"
}

Plotly.plot('scatter', data, layout);
});