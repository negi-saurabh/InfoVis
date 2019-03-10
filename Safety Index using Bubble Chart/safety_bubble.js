function barChart(district, year){

  d3.csv("ams_safety_index_districts.csv",function(d){
      if(d.district_1_in_area==district || d.district_2_in_area==district || d.district_3_in_area==district){
      
        // var x = new Array();
        // x[10] = new Array();
        if(parseInt(year)==2014)
            {
        
              // x[0].push({LABEL: "avoidance", value: +d['avoidance_2014']})
              // x[1].push({LABEL: "crime index", value: +d['avoidance_2014']})
              // x[2].push({LABEL: "decay", value: +d['avoidance_2014']})
              // x[3].push({LABEL: "nuisance", value: +d['nuisance_2014']})

              return{
                "avoidance" : d.avoidance_2014,
                "crime index": d.crime_index_2014,
                "decay": d.decay_2014,
                "fear of crime": d.fear_of_crime_2014,
                "feelings of insecurity": d.feelings_of_insecurity_2014,
                "high impact crime": d.high_impact_crime_2014,
                "high volume crime": d.high_volume_crime_2014,
                "nuisance": d.nuisance_2014,
                "nuisance by persons": d.nuisance_by_persons_2014,
                "risk perception": d.risk_perception_2014,
                "safety index" : d.safety_index_2014
                
              }
            }
        else if(parseInt(year)==2015)
        {
          return {
                "avoidance" : d.avoidance_2015,
                "crime index": d.crime_index_2015,
                "decay": d.decay_2015,
                "fear of crime": d.fear_of_crime_2015,
                "feelings of insecurity": d.feelings_of_insecurity_2015,
                "high impact crime": d.high_impact_crime_2015,
                "high volume crime": d.high_volume_crime_2015,
                "nuisance": d.nuisance_2015,
                "nuisance by persons": d.nuisance_by_persons_2015,
                "risk perception": d.risk_perception_2015,
                "safety index" : d.safety_index_2015
          }
        }
        else if(parseInt(year)==2016)
        {
          // x[0].push({LABEL: "avoidance", value: +d['avoidance_2014']})
          // x[1].push({LABEL: "crime index", value: +d['avoidance_2014']})
          // x[2].push({LABEL: "decay", value: +d['avoidance_2014']})
          // x[3].push({LABEL: "nuisance", value: +d['nuisance_2014']})

          return {
                "avoidance" : d.avoidance_2016,
                "crime index": d.crime_index_2016,
                "decay": d.decay_2016,
                "fear of crime": d.fear_of_crime_2016,
                "feelings of insecurity": d.feelings_of_insecurity_2016,
                "high impact crime": d.high_impact_crime_2016,
                "high volume crime": d.high_volume_crime_2016,
                "nuisance": d.nuisance_2016,
                "nuisance by persons": d.nuisance_by_persons_2016,
                "risk perception": d.risk_perception_2016,
                "safety index" : d.safety_index_2016
                
          }
        }
        else if(parseInt(year)==2017)
        {
          return {
                "avoidance" : d.avoidance_2017,
                "crime index": d.crime_index_2017,
                "decay": d.decay_2017,
                "fear of crime": d.fear_of_crime_2017,
                "feelings of insecurity": d.feelings_of_insecurity_2017,
                "high impact crime": d.high_impact_crime_2017,
                "high volume crime": d.high_volume_crime_2017,
                "nuisance": d.nuisance_2017,
                "nuisance by persons": d.nuisance_by_persons_2017,
                "risk perception": d.risk_perception_2017,
                "safety index" : d.safety_index_2017
          }
        }
      }
  })
    .then(function(csv_data){
      debugger
      console.log(csv_data);

      var out1 = Object.keys(csv_data[0]).map(function(data){
        return [data,csv_data[0][data]];
      });
      console.log(out1);

      //convert numerical values from strings to numbers
      var out = out1.map(function(d){ d.key = d[0]; d.value = d[1]; return d; });
      console.log(out);
      // set the dimensions and margins of the graph
      var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 800 - margin.left - margin.right,
      format = d3.format(",d"),
      height = 600 - margin.top - margin.bottom;
      

      // append the svg object to the body of the page
      var svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
  
    
      svg.append("text")
        .attr("x", 80)   
        .attr("y", 20 )
        .attr("dy", ".5em" )
        .attr("text-anchor", "start")  
        .style("font-size", "15px")  
        .style("font-weight", "bold")
        .text("Saferty Index parameters in "+district +" for " +year)

      var tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("padding", "8px")
        .style("background-color", "rgba(0, 0, 0, 0.75)")
        .style("border-radius", "6px")
        .style("font", "12px sans-serif")
        .text("tooltip");
  
      var pack = d3.pack()
          // .sum(function(d) { return d.value; })
          // .sort(function(a, b) { return b.value - a.value })
          .size([600, 700])
          .padding(1.5);
      
      
      
      var color = d3.scaleOrdinal()
          .domain(out.map(function(d){ return d.key;}))
          .range(['#fbb4ae','#596671','#ccebc5','#decbe4','#fed9a6',
          '#ffe9a8','#b9bfe3','#fddaec','#cccccc','#ccbccc','#515e4e']);
          
      var root = d3.hierarchy({children: out})
              .sum(function(d) { return d.value; })

      var node = svg.selectAll(".node")
          .data(pack(root).leaves())
          .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      node.append("circle")
          .attr("id", function(d) { return d.id; })
          .attr("r", function(d) { return d.r; })
          .style("fill", function(d) { return color(d.data.key); })
          .on("mouseover", function(d) {
                tooltip.text(d.data.key + ": " + format(d.value));
                tooltip.style("visibility", "visible");
                d3.select(this).style("stroke", "black");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function() {
              d3.select(this).style("stroke", "none");
              return tooltip.style("visibility", "hidden");
        });;

        var Xdatas = out.map(function (d) {
          return d.key;
        });    
        var values = out.map(function (d) {
          return d.value;
        });
  
  
        var xScale = d3.scaleBand().domain([0,10, 20, 30, 40 , 50 , 60 , 70 , 80 , 90]).rangeRound([0, width]).padding(0.1),
        yScale = d3.scaleLinear().domain([0, d3.max(values)]).rangeRound([height, 0]);

        svg.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'x axis')
          .call(d3.axisBottom(xScale));

      
        svg.append('g')
          .attr('transform', 'translate(0,0)')
          .attr('class', 'y axis')
          .call(d3.axisLeft(yScale).ticks(10));
      
        svg.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", width)
          .attr("y", height - 6)
          .style("font", "16px times")
          .text("Safety parameters normalized with 100");

        svg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", 6)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .style("font", "16px times")
          .text("District:  "+district );

      node.append("text")
          .attr("dy", ".2em")
          .style("text-anchor", "middle")
          .style("pointer-events", "none")
          .text(function(d) {return d.data.value});

      svg.append("g")
          .attr("class", "legendOrdinal")
          .attr("transform", "translate(600,40)");
        
      var legendOrdinal = d3.legendColor()
          .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
          .shapePadding(10)
          .scale(color);
        
      svg.select(".legendOrdinal")
          .call(legendOrdinal);
  });
};

barChart("Houthavens", 2014);



// convert numerical values from strings to numbers
// out = out.map(function(d){ d.value = +d[1]; return d; });