var width = 1000,
    height = 600,
    padding = 40;
var mydata;

var ranNumArr = [];
var step = 0;

function ranGenerator(max, min){
        return Math.floor((Math.random() * max) + min);
    }

$(function () {

    cluster = {};
  $(document).ready(function(){
        d3.csv("/static/Spending Dataset.csv", function (data) {
            mydata = data;
            cluster.axis(mydata);
            cluster.draw(mydata);
        });
        Draw_Table("/static/Spending Dataset.csv")
     })


     var tmp = {data:[{"a":1, "b":2},{"a":2, "b":2}]}



    cluster.next = function(){
        $.ajax({
            url:"/app/clusterNext",
//            url:"/app/kmeans",
            type:'POST',
            dataType:'json',
//            beforeSend: function(xhr) {
//                xhr.setRequestHeader("Accept", "application/json");
//                xhr.setRequestHeader("Content-Type", "application/json");
//            },
            data: {'centeroid':JSON.stringify(ranNumArr),'request_data': JSON.stringify(mydata),'step' : step},
            success: function(response){
//                 console.log(mydata)
//                console.log(response);
                console.log(response)
                mydata = response.DATA;
                ranNumArr = response.CEN;
                step = response.STEP;
                console.log(mydata)

                cluster.draw(mydata);
                Draw_CSV(mydata);
            },
            error:function(data,status,err) {
                console.log("error: " + data + " status: " + status + " err:" + err);
            }
        });
    }



    //TODO: onclick function
    $('#btnQuery').click(function(){

            if(step == 0){
                 for(var i = 0; i < 3; i++){
                 var tmp = ranGenerator(19, 0);
                 ranNumArr[i] = {'index' : tmp, 'x' : mydata[tmp].age, 'y' : mydata[tmp].spend};


                  for(var j = 0; j < i; j++ ){
                  // 이전값과 비교하여 중복일경우 random 값 다시 생성
                         if(ranNumArr[i].index == ranNumArr[j].index){
                             i = i - 1;
                             break;
                           }
                     }
                 }
                for(var i=0;i<3;i++){
                    mydata[ranNumArr[i].index].class = i+1;
                }
                console.log(ranNumArr)
                step = 1;
               console.log(mydata)
               cluster.draw(mydata);
               Draw_CSV(mydata);
            }
            else if(step == -1)
                console.log("it's done")
            else
                cluster.next();
        // }
    });

    cluster.axis = function(incomingData){
        var xmin = d3.min(incomingData, function(d){
        return d.age;
    });

    var xmax = d3.max(incomingData, function(d){
        return d.age;
    });

    var xScale = d3.scale.linear()
    .domain([xmin, xmax])
    .range([padding, width-padding]);
    var ymin = d3.min(incomingData, function(d){
        return d.spend;
    });

    var ymax = d3.max(incomingData, function(d){
        return d.spend;
    });

    var yScale = d3.scale.linear()
    .domain([parseFloat(ymax)+1, parseFloat(ymin)-1])
    .range([padding, height-padding]);

        var x_axis = d3.svg.axis()
                .scale(xScale)
                .ticks(incomingData.length)
                .orient("bottom");

            var y_axis = d3.svg.axis()
                .scale(yScale)
                .orient("left") ;

            var x_grid = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(incomingData.length)
                .tickSize(-(height-(padding*2)))
                .tickFormat("") ;

            var y_grid = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .tickSize(-(width-(padding*2)))
                .tickFormat("") ;



            d3.select("#cluster").append("g")
                .attr("class", "x grid")
                .attr("transform", "translate(0," + (height-padding) + ")")
                .call(x_grid);

            d3.select("#cluster").append("g")
                .attr("class", "y grid")
                .attr('transform', 'translate(' + padding + ',0)')
                .call(y_grid) ;

            d3.select("#cluster").append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height-padding) + ")")
                .call(x_axis);

            d3.select("#cluster").append("g")
                .attr("class", "y axis")
                .attr('transform', 'translate(' + padding + ',0)')
                .call(y_axis);
    }


    cluster.draw = function(incomingData){
     function classColor(c) { return { "1": "Royalblue", "2": "crimson", "3": "green" }[c]; }
    var xmin = d3.min(incomingData, function(d){
        return d.age;
    });

    var xmax = d3.max(incomingData, function(d){
        return d.age;
    });

    var xScale = d3.scale.linear()
    .domain([xmin, xmax])
    .range([padding, width-padding]);
    var ymin = d3.min(incomingData, function(d){
        return d.spend;
    });

    var ymax = d3.max(incomingData, function(d){
        return d.spend;
    });

    var yScale = d3.scale.linear()
    .domain([parseFloat(ymax)+1, parseFloat(ymin)-1])
    .range([padding, height-padding]);


            var circles = d3.select("#cluster")
                .selectAll("circle")
                .data(incomingData);

                circles.enter()
                .append("circle")
                .attr("cx",function(d){
                return xScale(d.age);
                })
                .attr("cy",function(d){
                return yScale(d.spend);
                })
                .attr("r", 5)
                .style("fill",function(d){
                    if(!d.class)
                    return "gray";
                    else{
                    return classColor(d.class);
                    }
                });

                circles.transition().duration(500)
                .style("fill",function(d){
                    if(!d.class)
                    return "gray";
                    else{
                    return classColor(d.class);
                    }
                });

           var steps = d3.select("#cluster")
           .selectAll("#steps")
           .data([0]);

           steps.enter()
           .append("text")
           .attr("id","steps")
           .attr("x",20)
           .attr("y",20)
           //.attr("transform","translate(20,20)")
          .text(function(){
                if(step == -1)
                    return "Complete"
                else
                    return "Step " + step;
           })
           .style("font-size" , "20px");

           steps.transition().duration(500)
           .text(function(){
                if(step == -1)
                    return "Complete"
                else
                    return "Step " + step;
           });
    }

})
