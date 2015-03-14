// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 20},
    width = 700 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.cpr); });

// Adds the svg canvas
var svg = d3.select("#cpr_hotmail")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

function make_x_axis() {
  return d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(20)
}

function make_y_axis(){
    return d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(20)

}

// Get the data

d3.tsv("static/data/hotmail.tsv", function(error, data) {
        data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.cpr = +d.cpr;
      });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.cpr; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_axis()
          .tickSize(-height, 0,0)
          .tickFormat("")
        );

    // text label for the x axis
    svg.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," +
                 (height+margin.bottom) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "10 px")
        .text("Import Date");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_axis()
          .tickSize(-width, 0, 0)
          .tickFormat("")
        )

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Click per Record");

    svg.append("text")
        .attr("x", (width/2))
        .attr("y", 0 - (margin.top/2))
        .attr("text-anchor", "middle")
        .style("font-size", "14 px")
        .text("CPR 7 Hotmail");

});
