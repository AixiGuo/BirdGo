var debug=false
var datapack=[]
$('#Submit').button().click(function () {
	var cmd = $("#CmdInput").val()
	console.log(cmd);
	Send(cmd);
})

$('#Debug').button().click(function(){
	debug=!debug;
})
$('#Fetch').button().click(function(){
	Send('Fetch');
})
function Send(cmd){
	var url = window.location.href;
	$.post(url + "CMD", { CMD: cmd }, function (result) {
		alert(result.ACK ? 'Successful' : 'Fail')
		if (result.dat != undefined) {
			$("#myTable").empty()
			for(var i=0;i<result.dat.length;i++){
				result.dat[i].ID=(1+i).toString();
			}
			$.jsontotable(result.dat, { id: '#myTable', header: false });
			datapack=result
			DrawOnMap() 
		}
	}); 
}



drawBuffer = []
nameBuffer = []
colorBuffer = []
filter =-1;

function DrawOnMap() {
	var data =datapack
	//remove
	for (var one in drawBuffer) {
		drawBuffer[one].remove()
	}


	drawBuffer = []
	nameBuffer = []
	colorBuffer = []

	for (var one in data.dat) {

		var name = data.dat[one].Name;
		var lat = data.dat[one].Latitude
		var lon = data.dat[one].Longtitude
		var time = data.dat[one].Time
		var poss = data.dat[one].Possibility

		if(lat == undefined || lon == undefined)
			continue

		var title = "<b>" + name + "</b><br>" +
			"Time:" + time + "<br>" +
			"Possibility:" + poss

		var i = findName(name);
		//var color = colorBuffer[i];
		var color =getColor(i)

		if(i!=filter && filter != -1){
			continue
		}

		var circle = L.circle([parseFloat(lat), parseFloat(lon)], {
			color: color,
			fillColor: color,
			fillOpacity: 0.5,
			radius: 50
		}).addTo(mymap);
		circle.bindPopup(title);
		drawBuffer.push(circle);

	}
	var str = ""
	for (var i = 0; i < nameBuffer.length; i++) {
		str += "<p style='border:2px solid " + getColor(i) + " '>" + i.toString() + "." + nameBuffer[i] + "  ";
		str += "<button class='selectBut' i='"  +i+  "'>Single</button></p>"
	}

	$('#text').html(str)
	$('.selectBut').button().on('click', function(event) {
		var i =parseInt(  $(event.target).attr( "i" ))
		if(filter == -1){
			filter = i;
			DrawOnMap()
		}else{
			if(filter != i ){
				filter = i;
				DrawOnMap();
			}else{
				filter =-1;
				DrawOnMap();
			}
		}
		console.log(i);
	})
}

function findName(name) {
	for (var i = 0; i < nameBuffer.length; i++) {
		if (nameBuffer[i] == name) {
			return i;
		}
	}
	nameBuffer.push(name)
	colorBuffer.push(getRandomColor())
	return nameBuffer.length - 1;
}


function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function getColor(i){
	var slot = 20
	var res=-parseInt(i/(360/20))*10 + 60 
	return 'hsl(' + i*slot + ', 100%, '+res+'%)'
}

var mymap = L.map('mapid').setView([51.431697, 6.774964], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiZnJpZW5kZ2ljIiwiYSI6ImNqd3h1c3VmNjBnN2c0OXA4dWV5aGt0eXgifQ.UjTy4JZBfcj0mv9DaVhvQQ'
}).addTo(mymap);



var popup = L.popup();


function onMapClick(e) {
	popup.setLatLng(e.latlng)
		.setContent(e.latlng.toString())
		.openOn(mymap);
	
		if(debug){
			var rp=Math.floor(Math.random() * (99 - 75) ) + 75;
			var rd=Math.floor(Math.random() * (18 - 11) ) + 11;
			var rh=Math.floor(Math.random() * (19 - 8) ) + 8;
			var rm=Math.floor(Math.random() * (59 - 0) ) + 0
			var lat = parseInt(e.latlng.lat * 1000000)/1000000.0
			var lng = parseInt(e.latlng.lng * 1000000)/1000000.0
			var str = 'Report; ;'+ lat+";"+ lng+";"+rp+";10/"+rd+"/2019-"+rh+":"+rm
			
			$('#CmdInput').val(str)
		}

}

mymap.on('click', onMapClick);

Send('Fetch');