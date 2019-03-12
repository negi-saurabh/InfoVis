var year=2017;// default year

d3.json("../data/map.geojson").then(mapDraw);//import mapbox
    
    function mapDraw(geojson){    

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpbWl6dSIsImEiOiJjam95MDBhamYxMjA1M2tyemk2aHMwenp5In0.i2kMIJulhyPLwp3jiLlpsA'
        
    var map = new mapboxgl.Map({//set map default
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v8',
        center: [4.9, 52.366667],
        zoom: 10.5,  
    })
    
    map.addControl(new mapboxgl.NavigationControl());
    
    function mapVis(map, year){//draw map function
        var container = map.getCanvasContainer()
        var svg = d3.select(container).append("svg")
        var tooltip = d3.select("body")
                        .append("div")
                        .attr("id","tooltip")
                        .style("opacity",0);


        var transform = d3.geoTransform({point: projectPoint});
        var path = d3.geoPath().projection(transform);
        
        var color = d3.scaleQuantize().domain([20,120])//color in different district, color scale
                .range(['#FF3333', '#FF9933', '#FFFF33','#99FF33', '#33FF33', '#33FF99','#33FFFF','#33CCFF','#3399FF','#3333FF','#9933FF']);
        
        svg.selectAll('rect.legend')//add color scale
            .data([20,30,40,50,60,70,80,90,100,110,120])
            .enter()
            .append('rect')
            .attr('class', 'legend')
            .attr('x', 45)
            .attr('y', function(d, i) { return 180 - 15 * i; })
            .attr('width', 20)
            .attr('height', 15)
            .attr('fill', function(d) { return color(d); });        

        svg.selectAll('text.legend')//add text for color scale
            .data([20,30,40,50,60,70,80,90,100,110,120])
            .enter()
            .append('text')
            .attr('x', 40)
            .attr('y', function(d, i) { return 180 - 15 * i + 12; })
            .attr('font-size', 9)
            .attr('text-anchor', 'end')
            .text(function(d) { return d ; });

        var featureElement = svg.selectAll("path")//draw map in different color
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("stroke", "red")
            .attr("fill", function (d) {
                    return color(d.properties['living_condition_score_'+year]);
            })
            .attr("fill-opacity", 0.7);
        
        function update() {//map details
            featureElement.attr("d", path)
            .attr('district', function(d) {
                return d.properties.district;
            })
            
            .style('cursor', 'pointer')
            .on('mouseover', function(d){//mouse move on
                tooltip.style("opacity", 1)
                .html(d.properties['district']+'<br/>'+'Living Condition Score:     '+d.properties['living_condition_score_'+year]
                +'<br/>'+'Safety Score: '+d.properties['safety_index_'+year]+'<br/>'+'Population Stability Score: '+d.properties['population_stability_score_'+year])
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 40) + "px");

                var self = d3.select(this);
                self.style('fill', 'green');
            })
            .on('mouseout', function(d, i){//mouse move out
                tooltip.style("opacity", 0);
                var self = d3.select(this);
                self.transition()
                    .duration(300)
                    .style('fill', function(d, i) {
                        return color(d.properties['living_condition_score_'+year]);
                    })
            })
            .on('click', function (d, i) {//mouse click action, modify this part to show subgraphs
                var self = d3.select(this);
                self.style('fill', 'black')
                    .attr('id',d.properties['district']+year);                
                a='#'+d.properties['district']+year;
                console.log(a);
                var  otherDiv=document.getElementById('otherDiv');//get the objcet to be shown
                otherDiv.style.display="block";//show
                document.getElementById("subgraphFlag").innerHTML=a;
            });
    }
    
    map.on("viewreset", update)//set the view proporties
    map.on("movestart", function(){
		svg.classed("hidden", true);
	});	
    map.on("rotate", function(){
		svg.classed("hidden", true);
	});	
    map.on("moveend", function(){
		update()
		svg.classed("hidden", false);
	})

    update()
    function projectPoint(lon, lat) {
        var point = map.project(new mapboxgl.LngLat(lon, lat));
		this.stream.point(point.x, point.y);
    }

    d3.select("#up").on("click",function(){//button control year change
            if(year<2017){
                d3.select("svg").remove();
                year++;
                mapVis(map,year); 
                document.getElementById("yearFlag").innerHTML=year;   
            }            
        })
    d3.select("#down").on("click",function(){
            if(year>2014){
                d3.select("svg").remove();
                year--;
                mapVis(map,year);  
                document.getElementById("yearFlag").innerHTML=year;
            }            
        })
    
    };

    mapVis(map,year);
    }
    // b=document.getElementById("subgraphFlag").innerHTML;// click function test
    // c= '#'+b;
    // console.log(b);
    // $(document).click(function(event){
    //     var _con = $('#divTop');  // for unhide area
    //     if(!_con.is(event.target) && _con.has(event.target).length === 0){
    //         $('#otherDiv').hide(300);
    //     }
    // });//hide subgraph    