var HOME_PATH = window.HOME_PATH || '.';
var position = {
  "lat": 37.5666805,
  "lng": 126.9784147
};

markers = [];

var gu = ["%", "강동구", "송파구", "강남구", "서초구", "관악구", "동작구", "영등포구",
    "금천구", "구로구", "강서구", "양천구", "마포구", "서대문구", "은평구",
    "노원구", "도봉구", "강북구", "성북구", "중랑구", "동대문구", "광진구",
    "성동구", "용산구", "중구", "종로구"
  ],
  gu_eng = ["%", "gangdong", "songpa", "gangnam", "seocho", "kwanak", "dongjak", "youngdeungpo",
    "geumcheon", "guro", "gangseo", "yangcheon", "mapo", "seodaemun", "eunpyeong",
    "nowon", "dobong", "gangbuk", "sungbuk", "jungrang", "dongdaemun", "kwangjin",
    "sungdong", "yongsan", "jung", "jongro"
  ];


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: position,
    zoom: 16
  });
  var infoWindow = new google.maps.InfoWindow;

  var marker = new google.maps.Marker;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: pos
      });

      map.setCenter(pos);
      infoWindow.setPosition(pos);
      infoWindow.setContent('현재위치입니다.');
      infoWindow.open(map, marker);
      toggleBounce();
      geocoder = pos;
      geocodeLatLng(geocoder, map);
      console.log(infoWindow);
      console.log("Current Position mark ok");

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  var input = document.getElementById('address');
  console.log(input);
  var autocomplete = new google.maps.places.Autocomplete(input);
  console.log(autocomplete);
  autocomplete.bindTo('bounds', map);

  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infoWindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  // console.log(infowindowContent);
  // infoWindow.setContent(infowindowContent);
  // console.log(infoWindow.setContent(infowindowContent));

  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', function() {
    infoWindow.close();
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    console.log(place.name);
    console.log(place.place_id);
    marker.setVisible(true);
    // infoWindow.setContent(place.formatted_address);
    infoWindow.setContent(infowindowContent);
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-id'].textContent = place.place_id;
    infowindowContent.children['place-address'].textContent =
      place.formatted_address;
    infoWindow.open(map, marker);
    var addr = place.formatted_address;
    var mapInfo = map;
    requestInfo(mapInfo, addr);

  });

  function toggleBounce() {
    if (marker.getAnimation() === null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function requestInfo(mapInfo, addr) {
  console.log(mapInfo);
  var mapInfo = mapInfo;
  console.log("requestInfo: " + addr);
  var address_eng = '';
  for (var i = 0; ii = gu.length, address_eng, i < ii; i++) {
    var gu_name = gu[i];
    if (addr.indexOf(gu_name) !== -1) {
      console.log(addr.indexOf(gu_name));
      address_eng = gu_eng[i];
      break;
    }
  }
  console.log("requestInfo in address_eng: " + address_eng);
  var locationGeo = "location";
  // safetyMarkerInfo(mapInfo, locationGeo);
  // cctv_db 요청
  $.ajax({
      url: "cctv_addr",
      Type: "GET",
      data: {'address': address_eng},
      dataType: 'json',
      success: function(data) {
            console.log('cctv_success')
            var locationGeo = data;
            cctvMarkerInfo(mapInfo, locationGeo);
      }
  });
  //safety_db 요청
  $.ajax({
      url: "safety_addr",
      Type: "GET",
      data: {'address': address_eng},
      dataType: 'json',
      success: function(data) {
            console.log('safety_success');

            var locationGeo = data;
            console.log(locationGeo);
            safetyMarkerInfo(mapInfo, locationGeo);
      }
  });
}

function safetyMarkerInfo(mapInfo, locationGeo) {
  var infoWindow = new google.maps.InfoWindow();
  console.log("safetyMarkerInfo success:::");
  console.log(locationGeo);
  var resultsMap = mapInfo;
  var resultsInfo = [];
  var locationGeo = locationGeo,
    safety_addr = new Array(),
    safety_name = new Array();

  for (var i = 0; ii = locationGeo.length, safety_addr, safety_name, i < ii; i++) {
    safety_addr[i] = locationGeo[i]['address'];
    safety_name[i] = locationGeo[i]['name'];
  }
  // console.log(addr_to_co);
  // console.log(safety_name);
  for (var i = 0, ii = locationGeo.length, lat, lng; i < ii; i++) {
    var position = new google.maps.LatLng(locationGeo[i]['lat'], locationGeo[i]['lng']);
    marker = new google.maps.Marker({
      position: position,
      map: map,
      icon: 'resources/img/safety.png'
    });
    marker.setAnimation(google.maps.Animation.BOUNCE);
    // infowindowContent = document.getElementById('infowindow-content');
    // infoWindow.setContent(infowindowContent);
    // infowindowContent.children['place-id'].textContent = safety_name;
    // infowindowContent.children['place-address'].textContent = safety_addr;
  }
  markerInfo(safety_name, safety_addr);
  // for (var j = 0; jj = addr_to_co.length, address, j < jj; j++) {
  //   address = addr_to_co[j];
  //   // safety_name = safety_name[j];
  //   var geocoder = new google.maps.Geocoder();
  //   console.log(address);
  //   // console.log(safety_name);
  //   geocoder.geocode({
  //     address: address
  //   }, function(results, status) {
  //     if (status === 'OK') {
  //       resultsMap.setCenter(results[0].geometry.location);
  //       marker = new google.maps.Marker({
  //         map: resultsMap,
  //         position: results[0].geometry.location,
  //         title: "Safety Zone!",
  //         icon: 'resources/img/safety.png'
  //       });
  //       resultsInfo = results[0].formatted_address;
  //       markerInfo(resultsInfo);
  //     } else {
  //       alert('Geocode was not successful for the following reason: ' + status);
  //     }
  //   });
  // }
}



function cctvMarkerInfo(mapInfo, locationGeo) {
  console.log("cctvMarkerInfo success:::");
  console.log(locationGeo);
  var locationGeo = locationGeo;
  var resultsMap = mapInfo;
  for (var i = 0, ii = locationGeo.length, lat, lng; i < ii; i++) {
    var position = new google.maps.LatLng(locationGeo[i]['lat'], locationGeo[i]['lng']);
    marker = new google.maps.Marker({
      position: position,
      map: map,
      icon: 'resources/img/cctv.png'
    });
  }
}

function markerInfo(safety_name, safety_addr) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  marker.addListener('click', function() {
    // var infoWindow = new google.maps.InfoWindow();
    // var infowindowContent = document.getElementById('infowindow-content');
    // infoWindow.setContent(infowindowContent);
    // infowindowContent.children['place-id'].textContent = safety_name;
    // infowindowContent.children['place-address'].textContent = safety_addr;
    infoWindow.open(map, marker);
  });
}

function geocodeLatLng(geocoder, map, infowindow) {
  var input = geocoder;
  console.log(input);
  var geocoder = new google.maps.Geocoder;
  // var latlngStr = input.split(',', 2);
  // var latlng = {lat: parseFloat(input[0]), lng: parseFloat(input[1])};
  geocoder.geocode({'location': input}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        mapInfo = map;
        addr = results[0].formatted_address;
        requestInfo(mapInfo, addr);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

function deleteMarkers() {
        clearMarkers();
        markers = [];
}

function search_addr(address) {
  var addr = address["0"].value;
  console.log(addr);
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({
    address: addr
  }, function(results, status) {
    if (status === 'OK') {
      map = new google.maps.Map(document.getElementById('map'), {
        center: results[0].geometry.location,
        zoom: 16
      });
      console.log(results);
      map.setCenter(results[0].geometry.location);
      marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
      });
      requestInfo(mapInfo, addr);
      var infoWindow = new google.maps.InfoWindow();
      var infowindowContent = document.getElementById('infowindow-content');
      infoWindow.setContent(infowindowContent);
      infowindowContent.children['place-address'].textContent = results["0"].formatted_address;
      infoWindow.open(map, marker);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

$('#GPS').on('click', initMap);
