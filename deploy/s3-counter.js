var fs = require('fs')
var moment = require('moment');
var spawn = require('child_process').spawn;
var path = require('path');
var os = require('os');

var env = JSON.parse(fs.readFileSync(path.join(os.homedir(), 'keys.json'), { encoding: 'utf8' }));

//-------------

var text = '';
const child = spawn('/usr/local/bin/aws', ['s3', 'ls', 's3://colourful-past/', '--recursive'], { env });

child.stdout.on('data', (data) => {
  text += data;
});

child.stderr.on('data', (data) => {});

//-------------

child.on('close', (code) => {

  var lines = text.split('\n');

  var date_counts = {};
  var data_array = [];

  lines.forEach((line) => {
    if (!line) { return; }
    var d = moment(line.substr(0, 19) + ' +00:00', "YYYY-MM-DD HH:mm:ss Z").startOf('hour').toISOString();

    if (!date_counts[d]) {
      date_counts[d] = 1;
    } else {
      date_counts[d] ++;
    }
  });

  //-------------

  for (var date in date_counts) {
    data_array.push({ date: date, value: date_counts[date] });
  }

  data_array.sort((a, b) => {
    if (a.date < b.date) { return -1; }
    if (a.date > b.date) { return 1; }
    return 0;
  });

  //-------------

  var output = '<!DOCTYPE html><meta charset="utf-8"><head><style> \n\
    .axis {\n\
      font: 10px sans-serif;\n\
    }\n\
    .axis path,\n\
    .axis line {\n\
      fill: none;\n\
      stroke: #000;\n\
      shape-rendering: crispEdges;\n\
    }\n\
    </style>\n\
  </head>\n\
  <body>\n\
  <script src="http://d3js.org/d3.v3.min.js"></script>\n\
  <script>\n\
  var margin = {top: 20, right: 20, bottom: 100, left: 40},\n\
      width = 900 - margin.left - margin.right,\n\
      height = 500 - margin.top - margin.bottom;\n\
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);\n\
  var y = d3.scale.linear().range([height, 0]);\n\
  var xAxis = d3.svg.axis()\n\
      .scale(x)\n\
      .orient("bottom")\n\
      .tickFormat(d3.time.format("%b %d %I:%M %p"));\n\
  var yAxis = d3.svg.axis()\n\
      .scale(y)\n\
      .orient("left")\n\
      .ticks(10);\n\
  var svg = d3.select("body").append("svg")\n\
      .attr("width", width + margin.left + margin.right)\n\
      .attr("height", height + margin.top + margin.bottom)\n\
    .append("g")\n\
      .attr("transform", \n\
            "translate(" + margin.left + "," + margin.top + ")");\n';

  output += 'var data = ' + JSON.stringify(data_array) + ';\n';

  output += 'data.forEach(function(d) {\n\
          d.date = new Date(d.date);\n\
      });\n\
    x.domain(data.map(function(d) { return d.date; }));\n\
    y.domain([0, d3.max(data, function(d) { return d.value; })]);\n\
    svg.append("g")\n\
        .attr("class", "x axis")\n\
        .attr("transform", "translate(0," + height + ")")\n\
        .call(xAxis)\n\
      .selectAll("text")\n\
        .style("text-anchor", "end")\n\
        .attr("dx", "-.8em")\n\
        .attr("dy", "-.55em")\n\
        .attr("transform", "rotate(-90)" );\n\
    svg.append("g")\n\
        .attr("class", "y axis")\n\
        .call(yAxis)\n\
      .append("text")\n\
        .attr("transform", "rotate(-90)")\n\
        .attr("y", 6)\n\
        .attr("dy", ".71em")\n\
        .style("text-anchor", "end")\n\
        .text("Images per hour");\n\
    svg.selectAll("bar")\n\
        .data(data)\n\
      .enter().append("rect")\n\
        .style("fill", "steelblue")\n\
        .attr("x", function(d) { return x(d.date); })\n\
        .attr("width", x.rangeBand())\n\
        .attr("y", function(d) { return y(d.value); })\n\
        .attr("height", function(d) { return height - y(d.value); });\n\
  document.write("<p>Total count: " + data.reduce((prev, cur) => prev + cur.value, 0) + "</p>");\n\
  </script></body>\n';

  console.log(output);

});

