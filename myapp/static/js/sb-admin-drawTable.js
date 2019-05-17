
function Draw_CSV(data) {
 var columns = Object.keys(data[0]);
 console.log(columns)
 function classColor(c) { return { "1": "Royalblue", "2": "crimson", "3": "green" }[c]; }
    var tmp = d3.select('#tooltip');


    var table = d3.select('#tooltip')

    var tbody = table.select('tbody')

    var thead = d3.select('thead')
        .selectAll('th')
        .data(columns);

    thead.enter()
        .append('th')
        .text(function (d) { return d })

    thead.transition().duration(500)
    .text(function (d) { return d })

    var rows = tbody.selectAll('tr')
        .data(data)


    rows.enter()
        .append('tr')
        .attr("class", function(d,i){
        return "r" + i;
        })
        .style("color",function(d){
            if(!d.class)
            return "gray"
            else
            return classColor(d.class);
        });

    rows.transition().duration(500)
        .style("color",function(d){
            if(!d.class)
            return "gray"
            else
            return classColor(d.class);
        });

    var cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] }
            })
        });


        cells.enter()
        .append('td')
        .text(function (d) { return d.value });

        cells.transition().duration(500)
.text(function (d) { return d.value });




    return table;
}

function Draw_Table(file) {
    d3.csv(file, function (data) {
        Draw_CSV(data);
    });
}
