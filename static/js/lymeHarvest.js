
// Chart Params
var svgWidth = 500;
var svgHeight = 300;
var circleRadius =7;
var formatComma = d3.format(",")

// Margins
var margin = { top: 20, right: 10, bottom: 10, left: 60 };

//Get width and height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an svg2 wrapper, append an svg2 group that will hold our chart, and shift the latter by left and top margins.
var svg3 = d3.select("#lymeHarvest")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup2 = svg3.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.json("/deerHarvestLyme",function(deerData) {

  // Create a function to parse date and time
  var parseTime = d3.timeParse("%Y");

  // Format the data
  deerData.forEach(function(data) {
    data[1] = parseTime(data[1]);
    data[2] = +data[2];
    data[3] = +data[3];
  });

  // Create scaling functions
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(deerData, d => d[1]))
    .range([0, width]);

  var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(deerData, d => d[2])])
    .range([height, 0]);

  var yLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(deerData, d => d[3])])
    .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xTimeScale)
    .tickFormat(d3.Year);
  var leftAxis = d3.axisLeft(yLinearScale1);
  var rightAxis = d3.axisRight(yLinearScale2);

  // Add x-axis
  chartGroup2.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y1-axis to the left side of the display
  chartGroup2.append("g")
    // Define the color of the axis text
    .classed("green", true)
    .call(leftAxis);

  // Add y2-axis to the right side of the display
  chartGroup2.append("g")
    // Define the color of the axis text
    .classed("red", true)
    .attr("transform", `translate(${width}, 0)`)
    .call(rightAxis);

  // Line generators for each line
  var line1 = d3.line()
    .x(d => xTimeScale(d[1]))
    .y(d => yLinearScale1(d[2]));

  var line2 = d3.line()
    .x(d => xTimeScale(d[1]))
    .y(d => yLinearScale2(d[3]));

  // Append a path for line1
  chartGroup2.append("path")
    .data([deerData])
    .attr("d", line1)
    .classed("line green", true);

  // Append a path for line2
  chartGroup2.append("path")
    .data([deerData])
    .attr("d", line2)
    .classed("line red", true);

    // append circles for harvested count
    var circlesGroup2 = chartGroup2.selectAll("circle1")
    .data(deerData)
    .enter()
    .append("circle")
    .attr("cx", d => xTimeScale(d[1]))
    .attr("cy", d => yLinearScale1(d[2]))
    .attr("r", circleRadius)
    .attr("fill", "yellowgreen")
    .attr("stroke-width", "1")
    .attr("stroke", "black");

    // append circles for lyme case count
    var circlesGroup3 =chartGroup2.selectAll("circle2")
    .data(deerData)
    .enter()
    .append("circle")
    .attr("cx", d => xTimeScale(d[1]))
    .attr("cy", d => yLinearScale2(d[3]))
    .attr("r", circleRadius)
    .attr("fill", "orange")
    .attr("stroke-width", "1")
    .attr("stroke", "black");
console.log(height - 60)
  // Append axes titles
  chartGroup2.append("text")
  .attr("transform", `translate(${width / 2}, ${height - 60})`)
  //.attr("transform", `translate(${width / 2}, ${height + margin.top + 200})`)
    .classed("har-text text", true)
    .text("Harvested Deer Count "); //#190#210

  chartGroup2.append("text")
  .attr("transform", `translate(${width / 2}, ${height - 80})`)
  //.attr("transform", `translate(${width / 2}, ${height + margin.top + 370})`)
    .classed("deer-text text", true)
    .text("Lyme Case Count");

 // Step 1: Initialize Tooltip
 var toolTip1 = d3.tip()
 .attr("class", "tooltip")
 .offset([80, -60])
 .html(function(d) {
    var dateFormat = d3.timeFormat("%Y");
   return (`<strong>Year: ${dateFormat(d[1])}<strong><hr>Harvested Deer Count: ${formatComma(d[2])}`);
 });

// Step 2: Create the tooltip in chartGroup.
chartGroup2.call(toolTip1);

// Step 3: Create "mouseover" event listener to display tooltip
circlesGroup2.on("mouseover", function(d) {
 toolTip1.show(d, this);
})
// Step 4: Create "mouseout" event listener to hide tooltip
 .on("mouseout", function(d) {
   toolTip1.hide(d);
 });

 // Step 1: Initialize Tooltip
 var toolTip2 = d3.tip()
 .attr("class", "tooltipx") 
 .offset([80, -60])
 .html(function(d) {
    var dateFormat = d3.timeFormat("%Y");
   return (`<strong>Year: ${dateFormat(d[1])}<strong><hr>Lyme Case Count: ${formatComma(d[3])}`);
 });

// Step 2: Create the tooltip in chartGroup.
chartGroup2.call(toolTip2);

// Step 3: Create "mouseover" event listener to display tooltip
circlesGroup3.on("mouseover", function(d) {
 toolTip2.show(d, this);
})
// Step 4: Create "mouseout" event listener to hide tooltip
 .on("mouseout", function(d) {
   toolTip2.hide(d);
 });

})