//Defining MARGINS | PADDING | DIMENSIONS
var svgWidth = parseInt(d3.select("#scatter").style("width"));
var svgHeight = svgWidth - svgWidth / 3.9;

//Margins
var margin = 20;

//Labels
var labelArea = 110;

//Padding
var tPadBottom = 40;
var tPadLeft = 40;

//SVG Wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

//Circle size
//NOTE - different screen sizes through the IF
var circleRadius;
function circleRadiusGet() {
  if (svgWidth <= 530) {
    circleRadius = 5;
  }
  else {
    circleRadius = 10;
  }
}
circleRadiusGet();

//Bottom Labels
svg.append("g").attr("class", "xText");

//Grabbing the text as a whole 
var xText = d3.select(".xText");

//Function for the text refresh for screen changes
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" + ((svgWidth - labelArea) / 2 + labelArea) + ", " + 
    (svgHeight - margin - tPadBottom) + ")"
  );
}
xTextRefresh();

//Appending POVERTY
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "GDP Per Capita")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("GDP Per Capita");

//Left Labels
svg.append("g").attr("class", "yText");

//Grabbing as a group
var yText = d3.select(".yText");

// Define variables to simplify the definition of the y group transform attr
var leftTextX = margin + tPadLeft;
var leftTextY = (svgHeight + labelArea) / 2 - labelArea;

//Function text refresh
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

//Appending Per capita c02 emissions
yText
  .append("text")
  .attr("y", -25)
  .attr("data-name", "CO2 Emissions | Total")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("CO2 Emissions | Per Capita");

//Appending per capita energy use
yText
  .append("text")
  .attr("y", -5)
  .attr("data-name", "Energy Use")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Energy Use | Per Capita");

//Appending per capita gasoline use on roads
yText
  .append("text")
  .attr("y", 15)
  .attr("data-name", "Road Sector Gasoline Consumption")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Gasoline Use | Per Capita");

yText
  .append("text")
  .attr("y", -45)
  .attr("data-name", "CO2 Emissions | Manufacture and Construct")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("CO2 Emissions | Mnfctrng & Cnstrctn");

//Importing CSV File through D3
d3.csv("assets/Resources/final3.csv").then(function(data) {
  // Display the current selected data
  displayCurrent(data);
});

//Creating a function to displace the data 
function displayCurrent(theData) {

//Default data for circle points 
  var curX = "GDP Per Capita";
  var curY = "CO2 Emissions | Total";

  // Empty variables to capture the min and max of the x and y data.
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  //Tooltip rule
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([10, 100])
    .html(function(d) {
      console.log(d);
      //X
      var theX;
      //STATE
      var theState = "<div>" + d.index + "</div>";
      //Our Y variable
      //NOTE it can stay constant as every Y datapoint is based on % unlike...
      var theY = "<div>" + curY + ": " + parseFloat(d[curY]).toLocaleString("en") + "</div>";
      //IF function to cite that if it is POVERTY displace %; otherwise...
      if (curX === "poverty") {
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        //Display in this form
        theX = "<div>" +
          curX + ": " + parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      //DISPLAY ME BABY
      return theState + theX + theY;
    });
  // Call the toolTip function.
  svg.call(toolTip);

 //Setting the MIN|MAX functions so we can get appropriate X|Y axis amounts
  function xMinMax() {
    //Grabbing the MIN, setting the minimum axis amount to 96%
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.95;
    });

    //Grabbing the MAX, setting maximum axis amount to 105%
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.05;
    });
  }

  function yMinMax() {
    //Grabbing the MIN, setting the minimum axis amount to 96%
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.95;
    });

    //Grabbing the MAX, setting maximum axis amount to 105%
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.05;
    });
  }

//Function to label change to cite what data we are bringing in 
  function labelChange(axis, clickedText) {
    //Active to inactive
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    //Text for the recently clicked label 
    clickedText.classed("inactive", false).classed("active", true);
  }

//CREATING THE SCATTER PLOT
//Setting our axis to plot the points  
  xMinMax();
  yMinMax();

  //Use of MIN|MAX to set up our scale variables
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, svgWidth - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([svgHeight - margin - labelArea, margin]);

  //Setting our AXIS
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  //Appending the AXIS visually
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (svgHeight - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  //Variable for CIRCLES 
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  //Append circle to the graph varying for each dataset
  theCircles
    .append("circle")
    // Specify location, size and class attributes.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circleRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.CODE;
    })
    
    //Defining what is displayed when hovering over with mouse
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      //Highlighting the border of the circle once hovered
      d3.select(this).style("stroke", "#323232");
    })
    //Defining what the graph should do once hovered off
    .on("mouseout", function(d) {
      toolTip.hide(d);
      //Taking off the circle highlight given above
      d3.select(this).style("stroke", "#e3e3e3");
    });

  //Creating the labels for the circles, putting abbreviated state names within 
  theCircles
    .append("text")
    //Text to abbreviation drawn from CSV; returning that
    .text(function(d) {
      return d.CODE;
    })
    //Scaling the text to put within
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius, adding a third of the radius to 
      // the height pushes it into the middle of the circle.
      return yScale(d[curY]) + circleRadius / 2.5;
    })
    .attr("font-size", circleRadius)
    .attr("class", "stateText")
    // Define the Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.CODE).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.CODE).style("stroke", "#e3e3e3");
    });

//LETS MAKE IT DYNAMIC CLICK LABEL ETC. 

  // Taking all the axes text and adding a D3 click event 
  d3.selectAll(".aText").on("click", function() {
    // Save the text as a reference later
    var self = d3.select(this);

    // If user selected the current label ignore the original selected and make the changes as mentioned. 
    // If the user selected the current label, ignore the selection, otherwise 
    // make the appropriate changes.
    if (self.classed("inactive")) {
      // Grabbing name and axis saved in label
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      //IF the axis == x....
      if (axis === "x") {
        // THEN...
        curX = name;

        // Change the min and max of the x-axis
        xMinMax();

        // Updating domain of x 
        xScale.domain([xMin, xMax]);

        // Transition to change the axis
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // Once the axis is changed, update the circles locations
        d3.selectAll("circle").each(function() {
          // Each transition for each circle to move to each specific location
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // Changing location for the text 
        d3.selectAll(".stateText").each(function() {
          // Adding the same transition/motion for the text as similiar to the circle transitions 
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // Changing classes for ACTIVE and CLICKED labels 
        labelChange(axis, self);
      }
      else {
        //When Y is THIS do THIS..
        curY = name;

        // Change the min and max of the y-axis.
        yMinMax();

        // Update the domain of y.
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // CHANGE LOCATIONS 
        d3.selectAll("circle").each(function() {
          // CHANGING CIRCLE TRANSITION AGAIN AS ABOVE COMPARE TO CONFIRM SIMILIAR TRANSITION AND MODIFICATION 
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        // Changing the state texts 
        d3.selectAll(".stateText").each(function() {
          // CHANGE TEXT AGAIN WITH SAME MOTION 
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circleRadius / 3;
            })
            .duration(300);
        });

        // Change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
    }
  });

  // MOBILE RESPONSE SECTION 
  //d3.select(window).on("resize", resize);

  // Creating the function to resize and specifying what and where the resize is and does 
  //function resize() {
    // Redefining the width, height, and lefttextY (the three variables dependent on)
    //svgWidth = parseInt(d3.select("#scatter").style("width"));
    //svgHeight = svgWidth / 3.9;
    //leftTextY = (svgHeight + labelArea) / 2 - labelArea;

    // Applying width/height to SVG 
    //svg.attr("width", svgWidth).attr("height", height);

    //Changing the scale to match 
    //xScale.range([margin + labelArea, svgWidth - margin]);
    //yScale.range([svgHeight - margin - labelArea, margin]);

    //Update the axis due to scale change
    //svg
      //.select(".xAxis")
      //.call(xAxis)
      //.attr("transform", "translate(0," + (svgHeight - margin - labelArea) + ")");

    //svg.select(".yAxis").call(yAxis);

    // Update the ticks on axis
    //tickCount();

    // Update the labels 
    //xTextRefresh();
    //yTextRefresh();

    //Updating radius for the circles 
    //circleRadiusGet();

    // Update location and radius for circles 
    //d3
      //.selectAll("circle")
      //.attr("cy", function(d) {
        //return yScale(d[curY]);
      //})
      //.attr("cx", function(d) {
        //return xScale(d[curX]);
      //})
      //.attr("r", function() {
        //return circleRadius;
      //});

    // Changing location and size of the text 
    //d3
      //.selectAll(".stateText")
      //.attr("dy", function(d) {
        //return yScale(d[curY]) + circleRadius / 3;
      //})
      //.attr("dx", function(d) {
        //return xScale(d[curX]);
      //})
      //.attr("r", circleRadius / 3);
  //}
}
