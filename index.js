//Get JSON & using Ajax
function getDataFromApi(currencyForex) {
  const settings = {
    'async': true,
    'crossDomain': true,
    'url': 'https://api.labstack.com/currency/convert?from=USD&to=CNY&value=1',
    'method': 'GET',
    'headers': {
      'Authorization': 'Bearer 5qCpoR1yN5ePigTWl2G1kG5T5tX8fAuV',
      'Cache-Control': 'no-cache',
    },
    'success': function(data){ convertCurrency(data) }
  }
  $.ajax(settings);
}

//function to create convert currency
function convertCurrency(result) {
  let converted = `
  <form role='form' class='exchangeConversion'>
  <fieldset name='convertCurrency'>
    <legend>Currency Exchange</legend> 
    <label for='js-homeland-currency' class='home_currency'></label>
    <table class='table'>
      <thead>
        <tr><th class='home_money'></th>USD<th class='travel_money'>CNY</th></tr>
      </thead>
      <tbody>
        <tr>
          <td id='homeland_money'></td>$1.00<td id='travelingCountry_money'>${result.value}</td>
        </tr>
      </tbody>
    </table>
    <section role="region" class="oneHomelandExchange"></section>
  </fieldset>
  </form>
  `;
  $('#travel-currency').html(converted);
}

//function to choose country and it will select currency
function activateExchangeWindow() {
  $('.js-submit-button').click(event=> {
    event.preventDefault();
    getDataFromApi();
    $('.travelex').hide();
//return value of current currency
    //const userInput = $(this).find('#js-home-currency')
    //$('.home_currency').text(`${userInput.val()} Amount`);
    //$('.home_money').text(`${userInput.val()}`)
    //const userInput = $(this).find('#js-current-country')
    //$('.travel_money').text(`${userInput.val()}`)
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

