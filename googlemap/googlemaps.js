cosnt myMap = () => {
  const myCenter = new google.maps.LatLng(37.335942, -121.886908);
  const bigBasin = new google.maps.LatLng(37.172670, -122.221556);
  const santaCruz = new google.maps.LatLng(36.966560, -122.016581);

  const myTrip = [myCenter, bigBasin, santaCruz];

  const mapCanvas = document.getElementById("googleMap");
  const mapOptions = {center:myCenter, zoom:9};

  const map = new google.maps.Map(mapCanvas, mapOptions);

  const marker = new google.maps.Marker({
    position: myCenter,
    animation: google.maps.Animation.BOUNCE
  });
  marker.setMap(map);

  const flightPath = new google.maps.Polyline({
    path: myTrip,
    strokeColor: "#0000FF",
    strokeOpacity: 0.8,
    strokeWeight: 2
  });
  flightPath.setMap(map);
}


