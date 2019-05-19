$(function () {
    width = 1500;
    height = 1500;
    margin = 20;
    var locX;
    var locYset = {};


    apriori = {};
    $(document).ready(function () {
        apriori.getAprioriData();
        apriori.generateNode();
    })


    apriori.getAprioriData = function () {
        $.ajax({
            url: "/app/getAprioriData",
            type: 'POST',
            dataType: 'json',
//            beforeSend: function(xhr) {
//                xhr.setRequestHeader("Accept", "application/json");
//                xhr.setRequestHeader("Content-Type", "application/json");
//            },
            success: function (response) {
                console.log(response.DATA);
                console.log(response.itemList);

                console.log(json);



                var json = response.DATA;
                var svg = d3.select("#apriori")
                    .attr("width", width)
                    .attr("height", height);

// build the arrow.
svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .style("fill","black");

                var force = d3.layout.force()
                    .gravity(.02)
                    .distance(100)
                    .charge(-100)
                    .size([width, height]);

                force.nodes(json.nodes)
                    .links(json.links)
                    .start();

                 var wScale = d3.scale.linear()
                    .domain([0,1])
                    .range([0 , 2])

                 var colorScale = d3.scale.linear()
                    .domain([
                         d3.min(json.links, function (d) {
                                return d.lift;
                            }),
                            d3.max(json.links, function (d) {
                                return d.lift;
                            })
                    ])
//                    .interpolate(d3.interpolateHcl)
//                    .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);
                    .range(["blue", 'red']);


                var link = svg.selectAll(".link")
                    .data(json.links)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", function (d) {
                        return wScale(d.conf);
                    })
                    .style("stroke",function(d){
                        return colorScale(d.lift)
                    })
                    .attr("marker-end", "url(#end)") ;

                var node = svg.selectAll(".node")
                    .data(json.nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .call(force.drag);

                var rScale = d3.scale.linear()
                    .domain([
                        d3.min(json.nodes, function (d) {
                                return d.sup;
                            }),
                            d3.max(json.nodes, function (d) {
                                return d.sup;
                            })
                    ])
                    .range([5, 15])

                    console.log("minsup & maxsup")
                console.log(d3.min(json.nodes, function (d) {
                                return d.sup;
                            }),
                            d3.max(json.nodes, function (d) {
                                return d.sup;
                            }))

                node.append("circle")
                    .attr("r", function (d) {
                        return rScale(d.sup);
                    })
                    .style("fill", function (d, i) {
                        return Color(d.group);
                    });

                node.append("text")
                    .attr("dx", 12)
                    .attr("dy", ".35em")
                    .text(function (d) {
                        return d.name
                    });

                force.on("tick", function () {
                    link.attr("x1", function (d) {
                        return d.source.x;
                    })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", function (d) {
                            return d.target.x;
                        })
                        .attr("y2", function (d) {
                            return d.target.y;
                        });

                    node.attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
                });


//                 var apData = response.DATA;
//                 var itemList = response.itemList;
//                 locX = d3.scale.ordinal().domain(['L','E','I','D','F','S']).rangeRoundBands([margin, width-margin], .1)
// //                locX = d3.scale.linear().domain([0, Object.keys(itemList).length]).range([margin, width-margin]);
//                 for (var i = 0; i < Object.keys(itemList).length; i++) {
//                     var locY = d3.scale.linear().domain([0, itemList[Object.keys(itemList)[i]].length]).range([margin, height-margin]);
//                     locYset[Object.keys(itemList)[i]] = locY;
//                 }
//
//                 var supScale = d3.scale.linear().range([0,.5])
//                 .domain([0, d3.max(apData,function(d){
//                 return d.sup;
//                 })]);
//
//                 var confScale = d3.scale.linear().range([0,2])
//                 .domain([0, d3.max(apData,function(d){
//                 return d.conf;
//                 })]);
//
//
//                 apriori.generateNode(itemList);
//                 apriori.generatePath(itemList, apData);
            },
            error: function (data, status, err) {
                console.log("error: " + data + " status: " + status + " err:" + err);
            }
        });
    }

    apriori.generatePath = function (itemList, apData) {

        var supScale = d3.scale.linear().range([.1, .7])
            .domain([0, d3.max(apData, function (d) {
                return d.sup;
            })]);

        var confScale = d3.scale.linear().range([0, 5])
            .domain([0, d3.max(apData, function (d) {
                return d.lift;
            })]);

        var paths = d3.select("#apriori")
            .selectAll(".apPath")
            .data(apData);

        paths.enter()
            .append("path")
            .attr("d", function (d) {
                var lhs = d.lhs.split('-')
                var rhs = d.rhs.split('-')

                console.log(locX(lhs[0]), locYset[lhs[0]](lhs[1]));
                console.log(lhs, rhs);
                return "M" + (locX(lhs[0]) + 5) + " " + (locYset[lhs[0]](lhs[1] - 1) + 5) + " " + "L" + (locX(rhs[0]) + 5) + " " + (locYset[rhs[0]](rhs[1] - 1) + 5);

            })
            .style("opacity", function (d) {
                return supScale(d.sup);
            })
            .attr("stroke-width", function (d) {
                return confScale(d.lift);
            });
    }


    apriori.generateNode = function (itemList) {
        function Color(c) {
            return {
                "1": '#B40404',
                '2': '#B43104',
                '3': '#B45F04',
                '4': '#B18904',
                '5': '#AEB404',
                '6': '#86B404'
            }[c]
        };


        for (var i = 0; i < Object.keys(itemList).length; i++) {
            /*
            *  라인, 설비 등의 카테고리 내의 아이템들의 노드 생성
            */
            var nodes = d3.select("#apriori")
                .selectAll(".c" + i)
                .data(itemList[Object.keys(itemList)[i]]);

            nodes.enter()
                .append("rect")
                .attr("class", "c" + i)
                .attr("id", function (d, index) {
                    return d;
                })
                .attr("transform", function (d, index) {

                    return "translate(" + locX(Object.keys(itemList)[i]) + "," + locYset[Object.keys(itemList)[i]](index) + ")"
                    // return "translate(" + (margin + (width - margin * 2) / Object.keys(itemList).length * i) + "," + (margin + (height - margin * 2) / itemList[Object.keys(itemList)[i]].length * index) + ")"
                })
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", function (d, i) {
                    return Color(i + 1);
                });

            /*
            *  라인, 설비 등의 카테고리 내의 아이템들의 노드 텍스트 생성
            */
            var nodetext = d3.select("#apriori")
                .selectAll(".textc" + i)
                .data(itemList[Object.keys(itemList)[i]]);

            nodetext.enter()
                .append("text")
                .attr("class", "textc" + i)
                .attr("id", function (d, index) {
                    return "textc" + i + "item" + index;
                })
                .attr("transform", function (d, index) {
                    return "translate(" + locX(Object.keys(itemList)[i]) + "," + locYset[Object.keys(itemList)[i]](index) + ")";
                })
                .text(function (d) {
                    return d;
                });

        }

        console.log(locYset)
    }
});