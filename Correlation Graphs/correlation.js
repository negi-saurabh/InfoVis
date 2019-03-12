function barChart(district){
  Promise.all([
        d3.csv("ams_stats_districts.csv"),
        d3.csv("ams_safety_index_districts.csv"),
      ]).then(function(files) {
        debugger
        console.log(files[0]);
        console.log(files[1]);
        // files[0] will contain ams_stats_districts.csv
        // files[1] will contain ams_safety_index_districts.csv
        var population = [];
        var safetyIndex = [];
        var highImpartCrime = [];
        for (var i=0; i < files[0].length; i++) {
          if(files[0][i].district==district){
              population.push({"key": 2014, "value": parseInt(files[0][i].population_2014)});
              population.push({"key": 2015, "value": parseInt(files[0][i].population_2015)});
              population.push({"key": 2016, "value": parseInt(files[0][i].population_2016)});
              population.push({"key": 2017, "value": parseInt(files[0][i].population_2017)});
              population.push({"key": 2018, "value": parseInt(files[0][i].population_2018)});
        }
        };

        for (var i=0; i < files[1].length; i++) {
          if(files[1][i].district_1_in_area==district|| files[1][i].district_2_in_area==district||files[1][i].district_3_in_area==district){
              safetyIndex.push({"key": 2014, "value": parseInt(files[1][i].safety_index_2014)});
              safetyIndex.push({"key": 2015, "value": parseInt(files[1][i].safety_index_2015)});
              safetyIndex.push({"key": 2016, "value": parseInt(files[1][i].safety_index_2016)});
              safetyIndex.push({"key": 2017, "value": parseInt(files[1][i].safety_index_2017)});  

              highImpartCrime.push({"key": 2014, "value": parseInt(files[1][i].high_impact_crime_2014)});
              highImpartCrime.push({"key": 2015, "value": parseInt(files[1][i].high_impact_crime_2015)});
              highImpartCrime.push({"key": 2016, "value": parseInt(files[1][i].high_impact_crime_2016)});
              highImpartCrime.push({"key": 2017, "value": parseInt(files[1][i].high_impact_crime_2017)});
             
        }
        };
      
        console.log(population);
        console.log(safetyIndex);

        var margin = {top: 20, right: 40, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        
        
        // set the ranges
        //var x = d3.scaleBand().range([0, width]);
        var y0 = d3.scaleLinear().range([height, 0]);
        var y1 = d3.scaleLinear().range([height, 0]);
        
        // define the 1st line
        var valueline = d3.line()
            .x(function(d) { return x(d.key); })
            .y(function(d) { return y0(d.value); });
        
        // define the 2nd line
        var valueline2 = d3.line()
            .x(function(d) { return x(d.key); })
            .y(function(d) { return y1(d.value); });
        
        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
          var Xdatas = population.map(function (d) {
              return d.key;
            }); 
        
          // Scale the range of the data
          var x = d3.scalePoint().domain(Xdatas).rangeRound([0, width]).padding(0.1);
          y0.domain([0, d3.max(population, function(d) {return Math.max(d.value);})]);
          y1.domain([0, d3.max(safetyIndex, function(d) {return Math.max(d.value); })]);
        
          // Add the valueline path.
          svg.append("path")
              .data([population])
              .attr("class", "line")
              .style("stroke", "steelblue")
              .style("fill","none")
              .style('stroke-width','3px')
              .attr("d", valueline);
        
          //Add the valueline2 path.  
          svg.append("path")
              .data([safetyIndex])
              .attr("class", "line")
              .style("stroke", "red")
              .style('stroke-width','3px')
              .style("fill","none")
              .attr("d", valueline2);
        
         //Add the valueline3 path.  
        //   svg.append("path")
        //       .data([highImpartCrime])
        //       .attr("class", "line")
        //       .style("stroke", "green")
        //       .style('stroke-width','3px')
        //       .style("fill","none")
        //       .attr("d", valueline2);

          svg.selectAll(".dot")
              .data(safetyIndex.filter(function(d) { return d.value; }))
              .enter().append("circle")
              .attr("class", "dot")
              .attr("cx", valueline2.x())
              .attr("cy", valueline2.y())
              .attr("r", 3.5);

          svg.selectAll(".dot2")
              .data(population.filter(function(d) { return d.value; }))
              .enter().append("circle")
              .attr("class", "dot2")
              .attr("cx", valueline.x())
              .attr("cy", valueline.y())
              .attr("r", 3.5);
        
        //  svg.selectAll(".dot3")
        //       .data(highImpartCrime.filter(function(d) { return d.value; }))
        //       .enter().append("circle")
        //       .attr("class", "dot3")
        //       .attr("cx", valueline2.x())
        //       .attr("cy", valueline2.y())
        //       .attr("r", 3.5);
    
        
          // Add the X Axis
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));
        
          // Add the Y0 Axis
          svg.append("g")
              .attr("class", "axisSteelBlue")
              .call(d3.axisLeft(y0));
        
          // Add the Y1 Axis
          svg.append("g")
              .attr("class", "axisRed")
              .attr("transform", "translate( " + width + ", 0 )")
              .call(d3.axisRight(y1));

      });
    }

barChart("Sloterdijk");



// convert numerical values from strings to numbers
// out = out.map(function(d){ d.value = +d[1]; return d; });