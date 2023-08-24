import { useEffect, useState } from "react";

const generateAddressWindow = (
  geocoder: google.maps.Geocoder,
  map: google.maps.Map,
  marker: google.maps.Marker,
  infowindow: google.maps.InfoWindow,
  location: google.maps.LatLng
) => {
  geocoder
    .geocode({ location })
    .then((res) => {
      if (res.results[0]) {
        infowindow.setContent(res.results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        alert("위치 정보가 존재하지 않습니다.");
      }
    })
    .catch((error) => {
      alert("Geocoder failed:" + error);
    });
};

function MapMarker(options: google.maps.MarkerOptions, map: google.maps.Map) {
  const [marker, setMarker] = useState<google.maps.Marker>();
  const [infowindow, setInfowindow] = useState<google.maps.InfoWindow>();
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();

  // * initial value setup
  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    if (!infowindow) {
      setInfowindow(new google.maps.InfoWindow());
    }

    if (!geocoder) {
      setGeocoder(new google.maps.Geocoder());
    }

    // ? 언마운트시 마커를 지도에서 삭제
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker, infowindow]);

  // * generate marker with options & onClick
  useEffect(() => {
    // ? 마커를 새로 생성할 때마다 기존 infoWindow는 닫는다.
    infowindow?.close();

    if (marker && infowindow && geocoder) {
      marker.setOptions(options);

      // ? 현재 마커의 위치 정보로 주소창 윈도우 생성
      marker.addListener("click", () => {
        const location = marker.getPosition() as google.maps.LatLng;
        generateAddressWindow(geocoder, map, marker, infowindow, location);
      });
    }
  }, [marker, options, infowindow, geocoder]);

  return null;
}

export default MapMarker;
