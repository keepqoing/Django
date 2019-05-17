var width = 1000,
    height = 800,
    initialScale = 5000,
    initialX = -10700,
    initialY = 3800,
    centered,
    labels
    ,circles;


/**** 메르카토르 투영법,TopoJSON Data를 이용해 지도 생성****/

var projection = d3.geo.mercator()
    .translate([initialX, initialY])
    .scale(initialScale);
//.translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);

/**** 지도 Zoom 기능 ****/
var zoom = d3.behavior.zoom()
    .translate(projection.translate())
    .scale(projection.scale())
    .scaleExtent([height, 800 * height])
    .on("zoom", zoom);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", 'map');

var states = svg.append("g")
    .attr("id", "states")
    .call(zoom);

// 점찍기
var places = svg.append("g")
    .attr("id", "places");

states.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);


d3.json("/static/korea_map.json", function (error, data) {
    var features = topojson.feature(data, data.objects["municipalities_geo"]).features;

    states.selectAll("path")
        .data(features)
        .enter().append("path")
        .attr("class", function (d) {
            return "municipality c" + d.properties.code
        })
        .attr("d", path)
        .on("click", click);

    labels = states.selectAll("text")
        .data(features)
        .enter().append("text")
        .attr("transform", function (d) {
            return "translate(" + path.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .attr("class", function (d) {
            return "municipality-label" + d.properties.code;
        })
        .style("font-size", "8px")
        .on("click", click)
        .text(function (d) {
            return d.properties.name;
        }) 
});


//지역 클릭시 줌
function click(d) {
    var x, y, k;

    if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }

    states.selectAll("path")
        .classed("active", centered && function (d) {
            return d === centered;
        });

    states.transition()
        .duration(1000)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");

    places.transition()
        .duration(1000)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
}

//마우스 휠 줌
function zoom(d) {
    var k = d3.event.scale / projection.scale();

    projection.translate(d3.event.translate).scale(d3.event.scale)
    states.selectAll("path").attr("d", path);

    labels.attr("transform", labelsTransform);


    circles.attr("transform", function (d) {
        return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")";
    })
        .attr("r", function (d) {
            return this.r.baseVal.value * k;
        });
}

function labelsTransform(d) {

    // 경기도가 서울특별시와 겹쳐서 예외 처리
    if (d.id == 8) {
        var arr = path.centroid(d);
        arr[1] += (d3.event && d3.event.scale) ? (d3.event.scale / height + 20) : (initialScale / height + 20);
        return "translate(" + arr + ")";
    } else {
        return "translate(" + path.centroid(d) + ")";
    }

}



// 버튼
//$('#radioo').buttonset();
$('#zoomin').button({
    text: false,
    icons: {
        primary: "ui-icon-plus"
    }
}).click(function () {
    var arr = projection.translate(),
        scale = projection.scale();

    arr[0] = arr[0] * 1.2;
    arr[1] = arr[1] * 1.2;
    scale = scale * 1.2;

    projection.translate(arr).scale(scale);
    states.selectAll("path").attr("d", path);

    labels.attr("transform", labelsTransform);
    circles.attr("transform", function (d) {
        return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")";
    })
});


$('#zoomout').button({
    text: false,
    icons: {
        primary: "ui-icon-minus"
    }
}).click(function () {
    var arr = projection.translate(),
        arr2 = projection.translate(),
        scale = projection.scale();

    arr[0] = arr[0] * 0.8;
    arr[1] = arr[1] * 0.8;
    scale = scale * 0.8;

    projection.translate(arr).scale(scale);
    states.selectAll("path").attr("d", path);

    labels.attr("transform", labelsTransform);
    circles.attr("transform", function (d) {
        return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")";
    })
});

// 지명표시
$('#radioo').find('input').on('click', function () {
    if (this.value == 'on') {
        labels.style('display', 'block');
    } else if (this.value == 'off') {
        labels.style('display', 'none');
    }
});


d3.csv("/static/places.csv", function (data) {
    circles = places.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("transform", function (d) {
            return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")";
        })
        .attr("r", 5)
        .on("mouseover", function (d,i) {
            if(i == 1)
                tt.style("visibility", "visible");

            tooltip.html(function(){
            return d.name + "<br>" + d.address;
            })
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () { return tooltip.style("top", (event.pageY-150) + "px").style("left", (event.pageX-240) + "px"); })
        .on("mouseout", function () {
        tt.style("visibility", "hidden");
        return tooltip.style("visibility", "hidden"); });

});

var tt = d3.select("#TT")
 .style("visibility", "hidden");

var tooltip = d3.select("#chart")
    .append("div")
    .style("position", "absolute")
    .attr("class", 'mytooltip')
    //.style("background",'orange')
    //.style("border",'2px solid black'):
    .style("z-index", "10")
    .style("visibility", "hidden");

var sampleSVG = d3.select(".example_div")
    .append("svg:svg")
    .attr("class", "sample")
    .attr("width", 300)
    .attr("height", 300);


