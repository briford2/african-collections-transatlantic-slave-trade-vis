var tastData = null;
var tastReady = false;
var collData = null;
var collReady = false;

var visWidth = $(window).width();
var visHeight = $(window).height()/2;
var barPadding = 1;

// Colors of the South African flag
var red = "#de3831";
var black = "#000000";
var green = "#007a4d";
var yellow = "#ffb612";
var blue = "#002395";

var fisheye =  d3.fisheye.scale(d3.scale.identity).domain([0,visWidth]).focus(visWidth/2).distortion(3);
var fontSizeFisheye = d3.fisheye.scale(d3.scale.log).domain([3,150]).range([8,15]).focus(12);
var fontOpacityFisheye = d3.fisheye.scale(d3.scale.log).domain([8,50]).range([0,1]).focus(1);
var tastYears,collYears,years;

var tastBarHeightDivideVal, collBarHeightDivideVal;

var tastBars, collBars;
var xSteps;

d3.csv('data/tastdb-min.csv')
  .row(function(d) {
    return {
      yearam: +d.yearam,
      slaximp: +d.slaximp
    };
  })
  .get(function(error, rows) {
    tastData = rows;
    tastReady = true;
    dataReady();
  });

d3.csv('data/collection.csv')
  .row(function(d) {
    return {
      year: +d.year,
      count: +d.count
    };
  })
  .get(function(error, rows) {
    collData = rows;
    collReady = true;
    dataReady();
  });

function dataReady() {
  if (tastReady && collReady) {
    // Create index of all the years used in both data sets
    tastYears = $.map(tastData,function(v){
      return v.yearam;
    });
    collYears = $.map(collData,function(v){
      return v.year;
    });
    years = arrayUnique(tastYears.concat(collYears));

    xSteps =  d3.range(0, visWidth, visWidth/years.length);
    // Add values to data arrays where there are no years, so data sets match
    var yearsLength = years.length;
    for (var i = 0; i < yearsLength; i++) {
      var found = false;
      for (var j = 0; j < tastData.length; j++) {
        if (tastData[j].yearam == years[i]) {
          found = true;
          break;
        }
      }
      if (!found) {
        tastData.push({yearam: years[i], slaximp: 0});
      }

      found = false;
      for (var j = 0; j < collData.length; j++) {
        if (collData[j].year == years[i]) {
          found = true;
          break;
        }
    }
      if (!found) {
        collData.push({year: years[i], count: 0});
      }
    }
    tastData.sort(tastCompare);
    collData.sort(collCompare);
    years.sort(intCompare);

    // Display TAST data
    var slaximpMax = Math.max.apply(Math,tastData.map(function(o){return o.slaximp;}))
    tastBarHeightDivideVal = slaximpMax / visHeight;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", visWidth)
        .attr("height", visHeight);

    tastBars = svg.selectAll("rect")
      .data(tastData)
      .enter()
      .append("rect")
      .attr("width", visWidth / tastData.length - barPadding)
      .attr("height", function(d) {
        return d.slaximp / tastBarHeightDivideVal;
      })
      .attr("x", function(d, i) {
        return i * (visWidth / tastData.length);
      })
      .attr("y", function(d) {
        return visHeight - (d.slaximp / tastBarHeightDivideVal);  //Height minus data value
      })
      .attr("fill", red);

    svg.on("mousemove", function() {
      var mouse = d3.mouse(this);
      fisheye.focus(mouse[0]);
      redraw();
    });

    svg.on("mouseout", function() {
      reset();
    });

    // Display collections data
    var countMax = Math.max.apply(Math,collData.map(function(o){return o.count;}))
    var collBarHeightDivideVal = countMax / visHeight;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", visWidth)
        .attr("height", visHeight);

    collBars = svg.selectAll("rect")
      .data(collData)
      .enter()
      .append("rect")
      .attr("width", visWidth / collData.length - barPadding)
      .attr("height", function(d) {
        return d.count / collBarHeightDivideVal;
      })
      .attr("x", function(d, i) {
        return i * (visWidth / collData.length);
      })
      .attr("y", 0)
      .attr("fill", green);

    svg.on("mousemove", function() {
      var mouse = d3.mouse(this);
      fisheye.focus(mouse[0]);
      redraw();
    });

    svg.on("mouseout", function() {
      reset();
    });
}
}

function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j])
        a.splice(j--, 1);
    }
  }

  return a;
}

function tastCompare(a,b) {
  return a.yearam - b.yearam;
}

function collCompare(a,b) {
 return a.year - b.year;
}

function intCompare(a,b) {
  return a - b;
}

function redraw() {
  tastBars
    .attr("x", function(d,i){
      return fisheye(xSteps[i%years.length]);
    })
    .attr("width", function(d,i){
      var rowNum = Math.floor(i/years.length);
      return (fisheye(xSteps[(i+1)%years.length] || visWidth) - fisheye(xSteps[i%years.length]))
    });

  collBars
    .attr("x", function(d,i){
      return fisheye(xSteps[i%years.length]);
    })
    .attr("width", function(d,i){
      var rowNum = Math.floor(i/years.length);
      return (fisheye(xSteps[(i+1)%years.length] || visWidth) - fisheye(xSteps[i%years.length]))
    });
}

function reset() {
  tastBars
    .attr("width", visWidth / years.length - barPadding)
    .attr("x", function(d, i) {
      return i * (visWidth / years.length);
    });

  collBars
    .attr("width", visWidth / years.length - barPadding)
    .attr("x", function(d, i) {
      return i * (visWidth / years.length);
    });
}

