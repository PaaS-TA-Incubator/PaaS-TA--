var HOME_PATH = window.HOME_PATH || '.';
var position = new naver.maps.LatLng(37.5666805, 126.9784147);
var gu = ["서울","강동구","송파구","강남구","서초구","관악구","동작구","영등포구",
          "금천구","구로구","강서구","양천구","마포구","서대문구","은평구",
          "노원구","도봉구","강북구","성북구","중랑구","동대문구","광진구",
          "성동구","용산구","중구","종로구"],
    gu_eng = ["seoul","gangdong","songpa","gangnam","seocho","kwanak","dongjak","youngdeungpo",
              "geumcheon","guro","gangseo","yangcheon","mapo","seodaemun","eunpyeong",
              "nowon","dobong","gangbuk","sungbuk","jungrang","dongdaemun","kwangjin",
              "sungdong","yongsan","jung","jongro"];


var cctv_Mark_info;
var safety_Mark_info;
var map = new naver.maps.Map("map", {
    center: position,
    // center: new naver.maps.LatLng(37.3595316, 127.1052133),
    zoom: 5,
    mapTypeId: naver.maps.MapTypeId.NORMAL
    // mapTypeControl: true
});

var safety_marker ='';
var safety_markerOp = '';

var infoWindow = new naver.maps.InfoWindow({
    anchorSkew: true,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderColor: "#808080",
    borderWidth: 1,
    anchorColor: "rgba(255, 255, 255, 1)",
    anchorSize: new naver.maps.Size(20, 16),
    pixelOffset: new naver.maps.Point(20, -20)
});



//마커 옵션 설정
// var safety_markerOp = {
//     position: new naver.maps.LatLng(37.6104324414, 126.917608077),
//     map: map,
//     icon: {
//         url: 'resources/img/safety.png',
//         size: new naver.maps.Size(30, 29),
//         origin: new naver.maps.Point(0, 0),
//         anchor: new naver.maps.Point(36, 35)
//     }
// };
//
// var cctv_markerOp = {
//     position: new naver.maps.LatLng(37.6100664, 126.9185487),
//     map: map,
//     icon: {
//         url: 'resources/img/cctv.png',
//         size: new naver.maps.Size(30, 29),
//         origin: new naver.maps.Point(0, 0),
//         anchor: new naver.maps.Point(35, 35)
//     }
// };
//
// var safety_marker = new naver.maps.Marker(safety_markerOp);
// var cctv_marker = new naver.maps.Marker(cctv_markerOp);
//


//마우스 모양
map.setCursor('pointer');

$('#GPS').on('click', function() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
  } else {
      var center = map.getCenter();
      infoWindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>');
      infoWindow.open(map, center);
  }
})


//내 현재 위치 표시
function onSuccessGeolocation(position) {
  var location = new naver.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

  map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
  map.setZoom(12); // 지도의 줌 레벨을 변경합니다.

  // infoWindow.setContent('<div style="padding:20px;">' + 'geolocation.getCurrentPosition() 위치' + '</div>');

  // infoWindow.open(map, location);
  var marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(location),
      map: map
  });
  // var contentString = [
  //     '<div class="iw_inner">',
  //     '   <h3>서울특별시청</h3>',
  //     '   <p>서울특별시 중구 태평로1가 31 | 서울특별시 중구 세종대로 110 서울특별시청<br />',
  //     '       <img src="" width="55" height="55" alt="서울시청" class="thumb" /><br />',
  //     '       02-120 | 공공,사회기관 &gt; 특별,광역시청<br />',
  //     '       <a href="http://www.seoul.go.kr" target="_blank">www.seoul.go.kr/</a>',
  //     '   </p>',
  //     '</div>'
  // ].join('');

  infoWindow.setContent('<div style="padding:20px;">' + '현재위치입니다.' + '</div>');
  // infoWindow.setContent([
  //         '<div style="padding:10px;min-width:200px;line-height:150%;">',
  //         '<h4 style="margin-top:5px;">검색 주소 : '+ response.result.userquery +'</h4><br />',
  //         addrType +' '+ item.address +'<br />',
  //         '</div>'
  //     ].join('\n'));
  // infoWindow.open(map, marker, point);
  infoWindow.open(map, marker, location);

  console.log('Coordinates: ' + location.toString());
  search_C_To_A(location);
}

function onErrorGeolocation() {
  var center = map.getCenter();

  infoWindow.setContent('<div style="padding:20px;">' +
      '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');

  infoWindow.open(map, center);
  console.log('error');
}

$(window).on("load", function() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
  } else {
      var center = map.getCenter();
      infoWindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>');
      infoWindow.open(map, center);
  }
});
// ~~~내 현재 위치 표시


// search by tm128 coordinate
function searchCoordinateToAddress(latlng) {
    var tm128 = naver.maps.TransCoord.fromLatLngToTM128(latlng);

    infoWindow.close();

    naver.maps.Service.reverseGeocode({
        location: tm128,
        coordType: naver.maps.Service.CoordType.TM128
    }, function(status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
            return alert('Something Wrong!');
        }

        var items = response.result.items,
            htmlAddresses = [];

        for (var i=0, ii=items.length, item, addrType; i<ii; i++) {
            item = items[i];
            addrType = item.isRoadAddress ? '[도로명 주소]' : '[지번 주소]';

            htmlAddresses.push((i+1) +'. '+ addrType +' '+ item.address);
        }

        infoWindow.setContent([
                '<div style="padding:10px;min-width:200px;line-height:150%;">',
                '<h4 style="margin-top:5px;">검색 좌표</h4><br />',
                htmlAddresses.join('<br />'),
                '</div>'
            ].join('\n'));

        infoWindow.open(map, latlng);
    });
}

// result by latlng coordinate
function searchAddressToCoordinate(address) {
    naver.maps.Service.geocode({
        address: address
    }, function(status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
            return alert('Something Wrong!');
        }

        console.log(response.result.userquery);

        var item = response.result.items[0],
            userquery = response.result.userquery,
            addrType = item.isRoadAddress ? '[도로명 주소]' : '[지번 주소]',
            point = new naver.maps.Point(item.point.x, item.point.y);

        for (var i=0; i<gu.length; i++){
          if(userquery === gu[i])
            {
              search_GeoJson(userquery);
              break;
            }
          else if(userquery === '서울시') {
            search_GeoJson(userquery);
            break;
          }
        }
        infoWindow.setContent([
                '<div style="padding:10px;min-width:200px;line-height:150%;">',
                '<h4 style="margin-top:5px;">검색 주소 : '+ response.result.userquery +'</h4><br />',
                addrType +' '+ item.address +'<br />',
                '</div>'
            ].join('\n'));


        map.setCenter(point);
        map.setZoom(12); // 지도의 줌 레벨을 변경합니다.
        infoWindow.open(map, point);
    });
}

function initGeocoder() {
    map.addListener('click', function(e) {
        call_LatLng($('#address').val());
        searchCoordinateToAddress(e.coord);
    });

    $('#address').on('keydown', function(e) {
        var keyCode = e.which;

        if (keyCode === 13) { // Enter Key
            call_LatLng($('#address').val());
            searchAddressToCoordinate($('#address').val());
        }
    });

    $('#submit').on('click', function(e) {
        e.preventDefault();
        call_LatLng($('#address').val());
        searchAddressToCoordinate($('#address').val());
    });


}

function call_LatLng(address) {
  if (typeof(cctv_Mark_info) != "undefined"){
    cctv_Mark_info.setMap(null);
    safety_Mark_info.setMap(null);
  }
  // var marker_remover = new naver.maps.Marker.setMap(null);
  console.log("call_LatLng: " + address);
  var address_eng = '';
  for (var i=0; ii=gu.length, address_eng, i<ii; i++) {
    var gu_name = gu[i];
    // console.log(gu[i]);
    if (address.indexOf(gu_name) !== -1) {
      console.log(address.indexOf(gu_name));
      address_eng = gu_eng[i];
      break;
    }
  }
  console.log("call_LatLng in address_eng: " + address_eng);
  //cctv_db 요청
  $.ajax({
      url: "cctv_addr",
      Type: "GET",
      data: {'address': address_eng},
      dataType: 'json',
      success: function(data) {
            console.log('cctv_db success')
            var locationGeo = data;
            cctv_Marker_L(locationGeo);
            // console.log(locationGeo);
      }
  });
  //safety_db 요청
  $.ajax({
      url: "safety_addr",
      Type: "GET",
      data: {'address': address_eng},
      dataType: 'json',
      success: function(data) {
            var locationGeo = data;
            safety_Marker_L(locationGeo);
            // console.log(locationGeo);
      }
  });
}

naver.maps.onJSContentLoaded = initGeocoder;

function cctv_Marker_L(locationGeo) {
  console.log("cctv_Marker_L success");
  var locationGeo = locationGeo;
  for (var i=0, ii=locationGeo.length, lat, lng; i<ii; i++) {
      var position = new naver.maps.LatLng(locationGeo[i]['lat'], locationGeo[i]['lng']);
      var cctv_markerOp = {
          position: position,
          map: map,
          icon: {
              url: 'resources/img/cctv.png',
              size: new naver.maps.Size(30, 29),
              origin: new naver.maps.Point(0, 0),
              anchor: new naver.maps.Point(35, 35)
          }
      };
      cctv_Mark_info = new naver.maps.Marker(cctv_markerOp);
  }
}

function safety_Marker_L(locationGeo) {
  // console.log(locationGeo.length);
  var locationGeo = locationGeo,
      addr_to_co = new Array(),
      safety_name = new Array();

  for (var i=0; ii=locationGeo.length, addr_to_co, safety_name, i<ii; i++) {
    addr_to_co[i] = locationGeo[i]['address'];
    safety_name[i] = locationGeo[i]['name'];
  }
  // console.log(addr_to_co);
  // console.log(safety_name);

  for (var i=0; ii=addr_to_co.length, address, i<ii; i++) {
    address = addr_to_co[i];

    naver.maps.Service.geocode({
        address: address
    }, function(status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
            return alert('Something Wrong!');
        }
        item = response.result.items[0];
        var position = new naver.maps.LatLng(item.point.y, item.point.x);
        // console.log(position);
        var safety_markerOp = {
            position: position,
            map: map,
            icon: {
                url: 'resources/img/safety.png',
                size: new naver.maps.Size(30, 29),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(36, 35)
            }
        };
        safety_Mark_info = new naver.maps.Marker(safety_markerOp);
    });
  }
}


function search_C_To_A(location) {

  var tm128 = naver.maps.TransCoord.fromLatLngToTM128(location);

  naver.maps.Service.reverseGeocode({
      location: tm128,
      coordType: naver.maps.Service.CoordType.TM128
  }, function(status, response) {
      if (status === naver.maps.Service.Status.ERROR) {
          return alert('Something Wrong!');
      }

      var items = response.result.items;
      var address_eng = '';
      console.log(items);
      for (var i=0, ii=items.length, item; i<ii; i++) {
          item = items[i];
      }
      console.log(item);
      for (var i=0, ii=gu.length; i<ii; i++) {
        if (item.addrdetail.sigugun === gu[i]) {
            address_eng = gu_eng[i]
            break;
        }
      }
      console.log("search_C_to_A in address_eng: " + address_eng);
      var locationGeo = [];
      //cctv_db 요청
      $.ajax({
          url: "cctv_addr",
          Type: "GET",
          data: {'address': address_eng},
          dataType: 'json',
          success: function(data) {
                var locationGeo = data;
                cctv_Marker_L(locationGeo);
                // console.log(locationGeo);
          }
      });
      //safety_db 요청
      $.ajax({
          url: "safety_addr",
          Type: "GET",
          data: {'address': address_eng},
          dataType: 'json',
          success: function(data) {
                var locationGeo = data;
                safety_Marker_L(locationGeo);
                // console.log(locationGeo);
          }
      });
  });
}

// function search_GeoJson(userquery){
//
//     var urlPrefix = 'resources/data/region/region',
//         urlName = []
//         urlSuffix = '.json',
//         regionGeoJson = [],
//         loadCount = 0;
//     var userquery = userquery,
//         address_eng = '';
//     console.log("userquery:" + userquery);
//
//     for (var i = 0; i < 26; i++) {
//       if (userquery === gu[i]) {
//         keyword = i;
//         address_eng = gu_eng[i];
//         console.log("keyword:" + keyword);
//         $.ajax({
//             url: urlPrefix + keyword + urlSuffix,
//             dataType: 'json',
//             success: function(geojson) {
//                     console.log("geojson: " + geojson);
//                     regionGeoJson[0] = geojson;
//                     startDataLayer();
//             }
//         });
//       }
//       else if (userquery === '서울시') {
//         for (var i = 1; i < 26; i++) {
//             var keyword = i +'';
//
//             $.ajax({
//                 url: urlPrefix + keyword + urlSuffix,
//                 dataType: 'json',
//                 success: function(idx) {
//                     // console.log("idx:" + idx);
//                     return function(geojson) {
//                         // console.log(geojson);
//                         regionGeoJson[idx] = geojson;
//
//                         loadCount++;
//                         // console.log(loadCount);
//
//                         if (loadCount === 25) {
//                             startDataLayer();
//                         }
//                     }
//                 }(i - 1)
//             });
//         }
//       }
//     }
//
//     var tooltip = $('<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');
//
//     tooltip.appendTo(map.getPanes().floatPane);
//
//     function startDataLayer() {
//         console.log('start Data Layer');
//         map.data.setStyle(function(feature) {
//             var styleOptions = {
//                 fillColor: '#ff0000',
//                 fillOpacity: 0.0001,
//                 strokeColor: '#ff0000',
//                 strokeWeight: 2,
//                 strokeOpacity: 0.4
//             };
//
//             if (feature.getProperty('focus')) {
//                 styleOptions.fillOpacity = 0.6;
//                 styleOptions.fillColor = '#0f0';
//                 styleOptions.strokeColor = '#0f0';
//                 styleOptions.strokeWeight = 4;
//                 styleOptions.strokeOpacity = 1;
//             }
//
//             return styleOptions;
//         });
//
//         regionGeoJson.forEach(function(geojson) {
//             console.log("add geojson");
//             console.log(geojson);
//             map.data.addGeoJson(geojson);
//             var geojson_Status = geojson;
//             console.log("forEach(geojson): " + geojson_Status);
//         });
//
//         map.data.addListener('click', function(e) {
//             var feature = e.feature;
//
//             if (feature.getProperty('focus') !== true) {
//                 feature.setProperty('focus', true);
//             } else {
//                 feature.setProperty('focus', false);
//             }
//         });
//
//         map.data.addListener('mouseover', function(e) {
//             var feature = e.feature,
//                 regionName = feature.getProperty('area1');
//             var opacity_num = '';
//             tooltip.css({
//                 display: '',
//                 left: e.offset.x,
//                 top: e.offset.y
//             }).text(regionName);
//
//             //criminal_db 요청
//             function get_criminal(){$.ajax({
//                 url: "criminal_level",
//                 Type: "GET",
//                 data: {'address': address_eng},
//                 dataType: 'json',
//                 success: function(data) {
//                       var opacity = data[0]['criminal_level'];
//                 }
//             });
//             return opacity
//           };
//
//
//           map.data.overrideStyle(feature, {
//                 fillOpacity: get_criminal(),
//                 strokeWeight: 4,
//                 strokeOpacity: 1
//             });
//         });
//
//         map.data.addListener('mouseout', function(e) {
//             tooltip.hide().empty();
//             map.data.revertStyle();
//         });
//     }
// }

// function remove_GeoJson(geojson) {
//     map.data.removeGeoJson(geojson);
//     console.log('remove GeoJson!');
//     GeoJson_status = 0;
//     console.log('remove_GeoJson, GeoJson_status: ' + GeoJson_status);
// }


function hideMarker(map, safety_marker) {
    if (!safety_marker.getMap()) return;
    safety_marker.setMap(null);
}
