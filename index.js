//Fixer endpoint URL
let endpoint = 'http://data.fixer.io/api/latest'
let access_key = 'a41ae6aa6920002743d80ef87e0fcb7c'

FIXER_URL = 'http://data.fixer.io/api/latest?access_key=a41ae6aa6920002743d80ef87e0fcb7c';

//Get JSON
function getDataFromApi(currencySelector, callback) {
  const settings = {
  url: 'http://data.fixer.io/api/latest?access_key=a41ae6aa6920002743d80ef87e0fcb7c',
  dataType: 'jsonp',
  success: function(json) {
    alert(json.rates.GBP);
    alert(json.base);
    alert(json.timestamp);
  }
  }
  $.ajax(settings);
}

//function to create convert currency
function convertCurrency() {
  return `
    <table>
    <tr>
      <td>Current Currency</td>
      <td><input id="fromAmount" type="text" placeholder="Amount to Convert"/></td>
    </tr>
    <tr>
      <td>Travel Currency</td>
      <td><input id="toAmount" type="text" /></td>
    </tr>
    </table>
  `;
}

//function to choose country and it will select currency
function activateExchangeWindow() {
  $('.js-submit-button').click(event=> {
    event.preventDefault();
    $('#travel-currency').html(convertCurrency());
    $('.travelex').hide();
//return value of current currency
    //const userInput = $(this).find('#js-home-currency')
    //$('.pCurrency').text(`${userInput.val()}`);
});
}

//Global variables for Google Maps
let map;
let infowindow;
let places;

//Initiate Google Maps default map location
function initMap() {
  let defaultPosition = {lat: 43.766680, lng: 11.248663};
  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultPosition,
    zoom: 15
  });
//const userInput = $('#js-current-location');
const autocomplete = new google.maps.places.Autocomplete(document.getElementById('js-current-location'));
const places = new google.maps.places.PlacesService(map)
autocomplete.addListener('place_changed', onPlaceChanged);

//Zoom to map location based on location search
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
 
//List banks on right panel
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

function handleCreateApp() {
  activateExchangeWindow();
}

$(handleCreateApp);

