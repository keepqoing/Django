$(function () {

    cluster = {};


    cluster.getData = function(){
        $.ajax({
//            url:"/app/clusterNext/",
            url:"/app/kmeans/",
            type:'POST',
            dataType:'JSON',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/json");
            },
            data:{'msg': 1},
            success: function(response){
                console.log(response.DATA);
                //cluster(response.DATA);
            },
            error:function(data,status,err) {
                console.log("error: " + data + " status: " + status + " err:" + err);
            }
        });
    }


    //TODO: onclick function
    $('#btnQuery').click(function(){
        var startDate = $('#txtStartDate').val();
        var endDate = $('#txtEndDate').val();

        // if(prodQty.convertStrDateTimeToEpoch(startDate) > prodQty.convertStrDateTimeToEpoch(endDate)){
        //     alert("Please check start date and end date");
        // }else {

            prodQty.getData(startDate,endDate);
        // }
    });

})
