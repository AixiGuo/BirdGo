$('#Submit').button().click(function () {
    var cmd = $("#CmdInput").val() 
    console.log(cmd);
    var url =window.location.href ;
    $.post(url+"CMD", {CMD:cmd}, function (result) {
        alert(result.ACK?'Successful':'Fail')
        if(result.dat!=undefined){  
            $("#myTable").empty()
            $.jsontotable(result.dat, { id: '#myTable', header: false });

          
        }
    });

})