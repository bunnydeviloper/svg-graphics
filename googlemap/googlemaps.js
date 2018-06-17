function myMap() {
  const mapProp= {
    center:new google.maps.LatLng(37.335942,-121.886908),
    zoom:10,
  };

  const map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

const marker = new google.maps.Marker({position: myCenter});

marker.setMap(map);
