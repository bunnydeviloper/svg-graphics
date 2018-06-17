function myMap() {
  const myCenter = new google.maps.LatLng(37.335942, -121.886908);
  const bigBasin = new google.maps.LatLng(37.172670, -122.221556);
  const santaCruz = new google.maps.LatLng(36.966560, -122.016581);
  const myTrip = [myCenter, bigBasin, santaCruz];

  const googleBldg = new google.maps.LatLng(37.422483, -122.087324);

  const mapCanvas = document.getElementById("googleMap");
  const mapOptions = {
    center:myCenter,
    zoom:9,
    mapTypeId: google.maps.MapTypeId.HYBRID, // photographic map + roads and city names
    // OR map.setMapTypeId(google.maps.MapTypeId.HYBRID);

    // if you want to turn off default controls: 'diableDefaultUI: true'
    // whereas turn on all controls:
    panControl: true,
    zoomControl: true,
    zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL},
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.TOP_LEFT
    },
    scaleControl: true,
    streetViewControl: true,
    overviewMapControl: true,
    rotateControl: true,

  }; 

  const map = new google.maps.Map(mapCanvas, mapOptions);

  const marker = new google.maps.Marker({
    position: myCenter,
    animation: google.maps.Animation.BOUNCE
  });
  marker.setMap(map);

  const infowindow = new google.maps.InfoWindow({content: "Hello World!"});

  google.maps.event.addListener(marker, "click", function() {
    const currentPos = map.getZoom();
    map.setZoom(14);
    map.setCenter(marker.getPosition());
    window.setTimeout(function() {map.setZoom(currentPos)}, 3000);

    infowindow.open(map, marker);
  });

  function placeMarker(map, location) {
    const marker2 = new google.maps.Marker({
      position: location,
      map: map
    });
    const infowindow2 = new google.maps.InfoWindow({
      content: 'Latitude: ' + location.lat() +
      '<br>Longtitude: ' + location.lng()
    });
    infowindow2.open(map, marker2);
  };

  google.maps.event.addListener(map, "click", function(event) {
    placeMarker(map, event.latLng);
  });

  const myCity = new google.maps.Circle({
    center: googleBldg,
    radius: 8000,
    strokeColor: "#0000FF",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#0000FF",
    fillOpacity: 0.4,
    editable: true,
  });
  myCity.setMap(map);

  const flightPath = new google.maps.Polyline({
    path: myTrip,
    strokeColor: "#0000FF",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    editable: true,
  });
  flightPath.setMap(map);
}
