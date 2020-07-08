
//Set canvas size
var svgWidth = 600;
var svgHeight = 350;

//Set up svg2 chartMargins
var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 60
};

//Calculcate chart width/height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Append chart area to canvas
const svg2 = d3.select('#deerCount')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

//Append chart group
var chartGroup1 = svg2.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

//Function  x-scale
function xScale(data) {
  //Create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[4])*.5, d3.max(data, d => d[4])*1.8])
    .range([0, width+100]);

  return xLinearScale;
}

//Function y-scale
function yScale(data) {
    //Create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[5])*.7, d3.max(data, d => d[5]*1.3)])
      .range([height, 0]);

    return yLinearScale;
  }

 //Function - Update Tooltip
function updateToolTip(circlesGroup1) {

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`County:  ${d[2]} <br>Total Sq Miles: ${d[3]} <br>Deer Population/Sq Mile: ${d[4]} <br>Lyme Cases: ${d[5]}`);
    });

  circlesGroup1.call(toolTip);

  //Tooltip show - onmouseover event
  circlesGroup1.on("mouseover", function(data) {
      toolTip.show(data);
     })

    //Tooltip hide - onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup1;
}

//Read the data
d3.json("/deerpopLyme",function(data) {

  console.log(data)

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Atlantic", "Cumberland", "Mercer", "Passaic","Somerset","Warren"])
    .range(d3.schemeSet1);

  //1: Create Scales
    // xLinearScale function
    var xLinearScale = xScale(data);

    // yLinearScale function
    var yLinearScale = yScale(data) ;

  // 2: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  // 3: Append Axes to Chart
    // append x axis
    var xAxis = chartGroup1.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup1.append('g')
        .attr("id", "y-axis")
        .call(leftAxis);

    // 4: Create Circles
    var circlesGroup1 = chartGroup1.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[4]))
        .attr('cy', d => yLinearScale(d[5]))
        .attr("r", function (d) {return d[3]*.075; } )
        .style("fill", function (d) { return myColor(d[2]); } )
        .attr("opacity", ".6");

  // 4: Create Axes Labels

      // Create group for  x-axis labels
      var xlabelsGroup = chartGroup1.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 20})`);

      // Create group for  y-axis labels
      var ylabelsGroup = chartGroup1.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 40})`);

      //Create x-axis lables and define position
      var deerCountLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 30)
          .attr("value", "deerCount") // value to grab for event listener
          .classed("active", true)
          .text("Deer Count per Square Mile");

      //Create y-axis lables and define position
      var lymeCountLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", (svgHeight/2))
          .attr("y", 0-(svgHeight/2)-35)
          .attr("value", "lymeCount") // value to grab for event listener
          .classed("active", true)
          .text("Lyme Case Count"); //#140,-210

    // 5. UpdateToolTip function above csv import
      circlesGroup1 = updateToolTip(circlesGroup1);
  });
