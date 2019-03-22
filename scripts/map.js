var year=2017;// default year

d3.json("data/map.geojson").then(mapDraw);//import mapbox

    function mapDraw(geojson){

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpbWl6dSIsImEiOiJjam95MDBhamYxMjA1M2tyemk2aHMwenp5In0.i2kMIJulhyPLwp3jiLlpsA'

    var map = new mapboxgl.Map({//set map default
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v8',
        center: [4.9, 52.356677],
        zoom: 10.7
    })
    //map.scrollWheelZoom.disable();
    map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl());

    var flagtest=0;

    var updatePic = function () {
        //d3.select("#divPanoramic").remove();
        // d3.select('canvas')
        //     .remove()
        flagtest=flagtest+1;
        console.log(flagtest);
        return flagtest;
    }

     async function panoramic (districtName) {
      ffff=updatePic();
      var manualControl = false;
      var longitude = 0;
      var latitude = 0;
      var savedX;
      var savedY;
      var savedLongitude;
      var savedLatitude;

      let picData = await d3.csv("data/filtered_panoramic.csv");
      let dataFind = {};

      picData.forEach(function (urlRow) {
          dataFind[urlRow.district] = urlRow.img_url;
      });

      var picUrl = dataFind[districtName]
      //console.log(districtName);
      //console.log(picUrl);
     //  d3.csv("panoramic.csv", function (csvdata) {
     //    imgKeys = ['img_url']
     // });

      // var panoramasArray = ["Grachtengordel-Zuid.jpg","Burgwallen-Nieuwe Zijde.jpg","Grachtengordel-West.jpg","Grachtengordel-Zuid.jpg","Nieuwmarkt-Lastage.jpg"];
      // var panoramaNumber = Math.floor(Math.random()*panoramasArray.length);

      // var districtName;
      // var imgUrl;
      // imgurl = 'https://data.amsterdam.nl/panorama/2018/09/19/TMX7316060226-000318/pano_0000_000000/equirectangular/panorama_2000.jpg'

      // setting up the renderer
      renderer = new THREE.WebGLRenderer();
      renderer.name = ('picRenderer')
      //console.log(renderer.name);
      renderer.setSize(350, 238);

      if(ffff>1){
        var  f = document.getElementById('divPanoramic')
        var child = f.childNodes;
        //console.log(child)
        f.removeChild(child[0]);
      }
      document.getElementById('divPanoramic').appendChild(renderer.domElement);

      // creating a new scene
      var scene = new THREE.Scene();
      scene.name = ('picScene')
      //scene.name = panoramicScene;

      // adding a camera
      var camera = new THREE.PerspectiveCamera(75, 384 / 216, 1, 1000);
      camera.target = new THREE.Vector3(0, 0, 0);

      // creation of a big sphere geometry
      var sphere = new THREE.SphereGeometry(100, 100, 40);
      sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

      // creation of the sphere material
      var sphereMaterial = new THREE.MeshBasicMaterial();
      THREE.ImageUtils.crossOrigin = '';
      sphereMaterial.map = THREE.ImageUtils.loadTexture(picUrl)

      // geometry + material = mesh (actual object)
      var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
      scene.add(sphereMesh);

      // listeners
      document.addEventListener("mousedown", onDocumentMouseDown, false);
      document.addEventListener("mousemove", onDocumentMouseMove, false);
      document.addEventListener("mouseup", onDocumentMouseUp, false);

               render();

               function render(){

        requestAnimationFrame(render);

        if(!manualControl){
          longitude += 0.1;
        }

        // limiting latitude from -85 to 85 (cannot point to the sky or under your feet)
                    latitude = Math.max(-75, Math.min(75, latitude));

        // moving the camera according to current latitude (vertical movement) and longitude (horizontal movement)
        camera.target.x = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.cos(THREE.Math.degToRad(longitude));
        camera.target.y = 500 * Math.cos(THREE.Math.degToRad(90 - latitude));
        camera.target.z = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.sin(THREE.Math.degToRad(longitude));
        camera.lookAt(camera.target);

        // calling again render function
        renderer.render(scene, camera);

      }

      // when the mouse is pressed, we switch to manual control and save current coordinates
      function onDocumentMouseDown(event){

        event.preventDefault();

        manualControl = true;

        savedX = event.clientX;
        savedY = event.clientY;

        savedLongitude = longitude;
        savedLatitude = latitude;

      }

      // when the mouse moves, if in manual contro we adjust coordinates
      function onDocumentMouseMove(event){

        if(manualControl){
          longitude = (savedX - event.clientX) * 0.1 + savedLongitude;
          latitude = (event.clientY - savedY) * 0.1 + savedLatitude;
        }

      }

      // when the mouse is released, we turn manual control off
      function onDocumentMouseUp(event){

        manualControl = false;

      }

      // pressing a key (actually releasing it) changes the texture map
      // document.onkeyup = function(event){
      //
      //   panoramaNumber = (panoramaNumber + 1) % panoramasArray.length
      //   sphereMaterial.map = THREE.ImageUtils.loadTexture(panoramasArray[panoramaNumber])
      //
      //     }

    }

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
            .attr("stroke", "orange")
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
                .html('<h5>'+'<b>'+'&nbsp;'+d.properties['district']+'</b>'+'&nbsp;'+'<br/>'+'&nbsp;Living Index:     '+d.properties['living_condition_score_'+year]
                + '<br/>' + '&nbsp;Safety Index: ' + d.properties['safety_index_' + year] + '<br/>' + '&nbsp;Population Index: ' + d.properties['population_stability_score_' + year] + '&nbsp;'+'</h5>')
                .style("background-color", "#F9EBEA")
                .style("border", "solid")
                .style("border-width", "0.4px")
                .style("border-radius","5px")
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
                var self = d3.select(this);
                self.style('fill', '#FDFEFE');
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
                // var otherDiv=document.getElementById('otherDiv');//get the objcet to be shown
                // otherDiv.style.display="block";//show
                // document.getElementById("subgraphFlag").innerHTML=a;
                var aa = $("#"+"divSubgraph").offset().top;
                $("html,body").animate({scrollTop:aa}, 'slow');
                var divPanoramic = document.getElementById('divPanoramic');
                divPanoramic.style.display="inline-block";
                var divCorrelation = document.getElementById('divCorrelation');
                divCorrelation.style.display="inline-block";
                divCorrelation.style.width="330";
                divCorrelation.style.height="240";
				var divPopulation = document.getElementById('divPopulation');
                divPopulation.style.display="inline-block";
                divPopulation.style.width="330";
                divPopulation.style.height="240";
                var bubble_chart  = document.getElementById('bubble-chart');
                bubble_chart.style.display="inline-block";//show
                bubble_chart.style.width="330";
                bubble_chart.style.height="240";
                panoramic(d.properties.district);
                correlationChart(d.properties.district);
				populationChart(d.properties.district, year);
                safetyChart(d.properties.district, year);

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
                //updatePic();
            }
        })
    d3.select("#down").on("click",function(){
            if(year>2014){
                d3.select("svg").remove();
                year--;
                mapVis(map,year);
                document.getElementById("yearFlag").innerHTML=year;
                //updatePic();
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
