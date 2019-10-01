$('#Submit').button().click(function () {
    var cmd = $("#CmdInput").val() 
    console.log(cmd);
    $.post("http://127.0.0.1:1200/CMD", {CMD:cmd}, function (result) {
        alert(result.ACK?'Successful':'Fail')
    });

})