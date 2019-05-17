$(function () {

    recommend = {};

    var incomingData = [];

    recommend.getData = function(){
        $.ajax({
            url:"/app/recommendation_default",
            type:'POST',
            dataType:'JSON',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/json");
            },
            success: function(response){
                console.log(response.DATA);
                for(var i=0; i<response.DATA.length;i++){
                d3.select("#movie"+(i+1))
                .html(response.DATA[i][0]);
                incomingData.push(response.DATA[i][0]);
                }

            },
            error:function(data,status,err) {
                console.log("error: " + data + " status: " + status + " err:" + err);
            }
        });
    }

    recommend.submit = function(tmp){
        $.ajax({
            url:"/app/recommendation_submit",
            type:'POST',
            dataType:'json',
//            beforeSend: function(xhr) {
//                xhr.setRequestHeader("Accept", "application/json");
//                xhr.setRequestHeader("Content-Type", "application/json");
//            },
            data: {'movie':incomingData,'rate': tmp},
            success: function(response){
                console.log(response.DATA);
            },
            error:function(data,status,err) {
                console.log("error: " + data + " status: " + status + " err:" + err);
            }
        });
    }

    $(document).ready(function(){
        recommend.getData();
    });

    //TODO: onclick function
    $('#btnQuery').click(function(){
        var tmp = [];
        for(var i=0;i<5;i++){
         tmp.push($('#rate'+ (i+1)).val());
        }

        var startDate = $('#rate1').val();
        var endDate = $('#txtEndDate').val();

        // if(prodQty.convertStrDateTimeToEpoch(startDate) > prodQty.convertStrDateTimeToEpoch(endDate)){
        //     alert("Please check start date and end date");
        // }else {

            recommend.submit(tmp);
        // }
    });

})
