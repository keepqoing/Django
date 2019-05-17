var width = 1000,
    height = 500,
    padding = 40;



d3.csv("/static/grade.csv", function (data) {

    var xmin = d3.min(data, function(d){
        return d.id;
    });

    var xmax = d3.max(data, function(d){
        return d.id;
    });

    var xScale = d3.scale.linear()
    .domain([xmin, xmax])
    .range([padding, width-padding]);

    var ymin = d3.min(data, function(d){
        return d.avegrade;
    });

    var ymax = d3.max(data, function(d){
        return d.avegrade;
    });

    var yScale = d3.scale.linear()
    .domain([4.5, ymin-0.5])
    .range([padding, height-padding]);

        var x_axis = d3.svg.axis()
                .scale(xScale)
                .ticks(data.length)
                .orient("bottom")
                 .tickFormat("");

            var y_axis = d3.svg.axis()
                .scale(yScale)
                .orient("left") ;

            var x_grid = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(data.length)
                .tickSize(-(height-(padding*2)))
                .tickFormat("") ;

            var y_grid = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .tickSize(-(width-(padding*2)))
                .tickFormat("") ;

            var xlabel = d3.select("#grade")
            .selectAll(".xlabel")
            .data(data)
            .enter()
            .append("text")
            .attr("class","xlabel")
            .attr("x", function(d,i){
                 return (((width-padding*2)/4) *d.id - (width-padding*2)/4 +5);
            })
            .attr("y", height-(padding/2))
            .text(function(d){
            return d.year + "년 " +  d.semester + "학기";
            });


            d3.select("#grade")
            .append("g")
                .attr("class", "x grid")
                .attr("transform", "translate(0," + (height-padding) + ")")
                .call(x_grid);

            d3.select("#grade").append("g")
                .attr("class", "y grid")
                .attr('transform', 'translate(' + padding + ',0)')
                .call(y_grid) ;

            d3.select("#grade").append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height-padding) + ")")
                .call(x_axis);

            d3.select("#grade").append("g")
                .attr("class", "y axis")
                .attr('transform', 'translate(' + padding + ',0)')
                .call(y_axis);

                 var draw_line = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return xScale(d.id); })
                .y(function(d) { return yScale(d.avegrade); }) ;

            var Gline = draw_line(data);

            var line = d3.select("#grade")
            .selectAll("#Gline")
            .data([0])
            .enter()
            .append("path")
            .attr("id","Gline")
            .attr("class","line")
            .attr("d",Gline);

});

