// // Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 600;

// // Define the chart's margins as an object
var chartMargin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// // Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// // Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .classed("chart", true)
  .attr("height", svgHeight)
  .attr("width", svgWidth);

  // // Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// // to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// // Load data from data.csv
d3.csv("assets/data/data.csv").then(function(HealthData) {

// Print the HealthData
console.log(HealthData);

//Convert poverty and healthcare data into numbers
  HealthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

//Create x and y linear scale
  var xLinearScale = d3.scaleLinear()
  .domain(d3.extent(HealthData, d => d.poverty))
  .range([0, chartWidth]);

  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(HealthData, d => d.healthcare)])
  .range([chartHeight, 0]);

//Create the axes
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);

//Append axes
  chartGroup.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(xAxis);
  chartGroup.append("g")
  .call(yAxis);

//Create the scatter plots
  var circlesGroup = chartGroup.selectAll("circle")
  .data(HealthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.healthcare +2.8))
  .attr("cy", d => yLinearScale(d.poverty +1.3))
  .attr("r", "12")
  .attr("fill", "green")
  .attr("opacity", .5)


//Create axes labels
   
chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, 510)`)
    .attr("class", "axisText")
    .text("Percentage In Poverty (%)");
  
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left + 10)
    .attr("x", 0 - (chartHeight - 100))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Percentage Who Lack Healtcare(%)");



//Create the tooltip and call the tool tip
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`<strong>Healthcare: ${d.healthcare}<br><strong>Poverty: ${d.poverty}
    `);
  });

  chartGroup.call(toolTip);

  //Create an event listener that hides and displayes the tooltip on a mouse hover
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
  // Step 4: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });
}).catch(function(error) {
  console.log(error);



});