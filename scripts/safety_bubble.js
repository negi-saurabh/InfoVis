var flagtest2=0;
var updatePic2 = function () {
  flagtest2=flagtest2+1;
  // console.log(flagtest2);
  return flagtest2;
}

function safetyChart(district, year){
  ffff2=updatePic2();
  // console.log(ffff2);
  
  if(ffff2>1){ 
    var  f = document.getElementById('bubble-chart')
    var child = f.childNodes;
    // console.log(child);
    var i;
    var childs  = child.length;
    for (i = 0; i < childs; i++) { 
      f.removeChild(child[0]);
    }
    
  };
  // console.log(district);
  // console.log(year);
  d3.csv("data/ams_safety_index_districts.csv",function(d){
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
                "feeling of insecurity": d.feelings_of_insecurity_2014,
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
                "feeling of insecurity": d.feelings_of_insecurity_2015,
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
                "feeling of insecurity": d.feelings_of_insecurity_2016,
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
                "feeling of insecurity": d.feelings_of_insecurity_2017,
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
      //debugger
      // console.log(csv_data);

      var out1 = Object.keys(csv_data[0]).map(function(data){
        return [data,csv_data[0][data]];
      });
      // console.log(out1);

      //convert numerical values from strings to numbers
      var out = out1.map(function(d){ d.key = d[0]; d.value = d[1]; return d; });
      // console.log(out);
      // set the dimensions and margins of the graph
      var margin = {top: 25, right: 10, bottom: 50, left: 2},
      width = 380 - margin.left - margin.right,
      format = d3.format(",d"),
      height = 250 - margin.top - margin.bottom;


      // append the svg object to the body of the page
      var svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");



      // svg.append("text")
      //   .attr("x", 80)
      //   .attr("y", 20 )
      //   .attr("dy", ".5em" )
      //   .attr("text-anchor", "start")
      //   .style("font-size", "15px")
      //   .style("font-weight", "bold")
      //   .text("Saferty Index parameters in "+district +" for " +year)

      var tooltip = d3.select("body")
                        .append("div")
                        .attr("id","tooltip")
                        .style("opacity",0);

      var pack = d3.pack()
          // .sum(function(d) { return d.value; })
          // .sort(function(a, b) { return b.value - a.value })
          .size([180, 180])
          .padding(1.5);



      var color = d3.scaleOrdinal()
          .domain(out.map(function(d){ return d.key;}))
          .range(['#FF3333', '#FF9933', '#FFFF33','#99FF33', '#33FF33', '#33FF99','#33FFFF','#33CCFF','#3399FF','#3333FF','#9933FF']);
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
          .style('cursor', 'pointer')
          .on('mouseover', function(d){//mouse move on
                tooltip.style("opacity", 1)
                .html(d.data.key + ": " + format(d.value))
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
                var self = d3.select(this);
                self.style('fill', 'pink');
          })
          .on('mouseout', function(d, i){//mouse move out
                tooltip.style("opacity", 0);
                var self = d3.select(this);
                self.transition()
                    .duration(300)
                    .style('fill', function(d, i) {
                        return color(d.data.key);
                    })
          })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            });

        var Xdatas = out.map(function (d) {
          return d.key;
        });
        var values = out.map(function (d) {
          return d.value;
        });


        var xScale = d3.scaleBand().domain([0,10, 20, 30, 40 , 50 , 60 , 70 , 80 , 90]).rangeRound([0, width]).padding(0.1),
        yScale = d3.scaleLinear().domain([0, d3.max(values)]).rangeRound([height, 0]);

        // svg.append('g')
        //   .attr('transform', 'translate(0,' + height + ')')
        //   .attr('class', 'x axis')
        //   .call(d3.axisBottom(xScale));


        // svg.append('g')
        //   .attr('transform', 'translate(0,0)')
        //   .attr('class', 'y axis')
        //   .call(d3.axisLeft(yScale).ticks(10));

        svg.attr('class', 'headerText')
          .append('text')
          .attr("id", "titleBar")
          .attr('transform', "translate(" + 100 + "," + 5 + ")")
          .attr('text-anchor', 'middle')
          .attr('font-weight', 600)
          .text('Safety Index parameters');

        svg.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", width-250)
          .attr("y", height+10)
          .style("text-anchor", "middle")
          .style("font", "16px times")
          .text(district +" in " +year)

        svg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", 6)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .style("font", "16px times");
          
      node.append("text")
          .attr("dy", ".2em")
          .style("text-anchor", "middle")
          .style("font", "12px times")
          .style("pointer-events", "none")
          .text(function(d) {return d.data.value});

      // svg.selectAll('rect.legend')//add color scale
      //       .data([out])
      //       .enter()
      //       .append('rect')
      //       .attr('class', 'legend')
      //       .attr('x', 45)
      //       .attr('y', function(d, i) { return 180 - 15 * i; })
      //       .attr('width', 20)
      //       .attr('height', 15)
      //       .attr('fill', function(d) { return color(d.key); });

      // svg.selectAll('text.legend')//add text for color scale
      //       .data([out])
      //       .enter()
      //       .append('text')
      //       .attr('x', 40)
      //       .attr('y', function(d, i) { return 180 - 15 * i + 12; })
      //       .attr('font-size', 9)
      //       .attr('text-anchor', 'end')
      //       .text(function(d) { return d.key ; });

      svg.append("g")
          .attr("class", "legendOrdinal")
          .style("font", "10.5px times")
          .attr("transform",
          "translate(" + 185 + "," + margin.top + ")");
      
      debugger
      var legendOrdinal = d3.legendColor()
          .shape("path", d3.symbol().type(d3.symbolSquare).size(60)())
          .shapePadding(2.5)
          .scale(color);

      svg.select(".legendOrdinal")
          .call(legendOrdinal);
  });
};

//barChart("Houthavens", 2014);



// convert numerical values from strings to numbers
// out = out.map(function(d){ d.value = +d[1]; return d; });
