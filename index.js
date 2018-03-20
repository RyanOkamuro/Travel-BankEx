//Global variables for Google Maps
let map;
let infowindow;
let places;

//Initiate Google Maps default map location
function initMap() {
  let defaultPosition = {lat: 34.019022, lng: -118.492806};
  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultPosition,
    zoom: 15
  });
  //const userInput = $('#js-current-location');
const autocomplete = new google.maps.places.Autocomplete(document.getElementById('js-current-location'));
const places = new google.maps.places.PlacesService(map)
autocomplete.addListener('place_changed', onPlaceChanged);

function onPlaceChanged() {
  let place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    }
  else if (!place.geometry) {
    window.alert("No results available for '" + place.name + "'");
    return;
  }
    infowindow = new google.maps.InfoWindow();
    places.nearbySearch({
          location: place.geometry.location,
          bounds: map.getBounds(),
          type: ['bank']
        }, callback);
  }
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

//Create bank markers
function createMarker(place) {
  let placesList = document.getElementById('bank_places');
  let placeLoc = place.geometry.location;
  let marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });
  
  let li = document.createElement('li');
  li.textContent = place.name;
  placesList.appendChild(li);
  li.onclick= function() {
    google.maps.event.trigger(marker, 'click');
    //HOW TO MAKE ANIMATION STOP BOUNCING
    //marker.setAnimation(google.maps.Animation.BOUNCE);
  };

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name + "<br />"+ place.vicinity);
    infowindow.open(map, this);
  });
}