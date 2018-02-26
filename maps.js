<!DOCTYPE html>
<html>
<body>

<button onclick="getLocation()">Geolocalização</button>

<p id="demo"></p>

<div id="map" style="width:400px;height:400px;"></div>

<script>
var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "O Browser não suporta geolocalização.";
    }
}

function initMap() {
 
}

function showPosition(position) {
   var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
}
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBu-916DdpKAjTmJNIgngS6HL_kDIKU0aU&callback=myMap"></script>

</body>
</html>
