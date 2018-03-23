
  //Get JSON
  function getDataFromApi(homeMoney, travelMoney, exchangeTotalAmount) {
    if (exchangeTotalAmount !== undefined) {
      const settings = {
        'async': true,
        'crossDomain': true,
        'url': `https://api.labstack.com/currency/convert?from=${homeMoney}&to=${travelMoney}&value=${exchangeTotalAmount}`,
        'method': 'GET',
        'headers': {
          'Authorization': 'Bearer 5qCpoR1yN5ePigTWl2G1kG5T5tX8fAuV',
          'Cache-Control': 'no-cache',
        },
        'success': function(data) {convertCurrency(data, homeMoney, travelMoney, exchangeTotalAmount)}
      }
      $.ajax(settings);

    } else {
      const settings2 = {
        'async': true,
        'crossDomain': true,
        'url': `https://api.labstack.com/currency/convert?from=${homeMoney}&to=${travelMoney}&value=1`,
        'method': 'GET',
        'headers': {
          'Authorization': 'Bearer 5qCpoR1yN5ePigTWl2G1kG5T5tX8fAuV',
          'Cache-Control': 'no-cache',
        },
        'success': function(data) {convertCurrency(data, homeMoney, travelMoney, exchangeTotalAmount)}
      }
      $.ajax(settings2);
    }
  }

  //Function to create convert currency
  function convertCurrency(result, homeMoney, travelMoney) {
    let converted = `
    <fieldset name='convertCurrency'>
      <legend>Currency Exchange</legend> 
      <label for='js-homeland-currency' class='home_currency'>${homeMoney} Amount to Exchange</label>
      <input type='number' placeholder='1.00' name='js-homeland-currency' id='js-homeland-currency-input'  autofocus/>
    </fieldset>
    <section role='region' class='foreignExchangeTotal'>
    <p class='beforeExchange'> 1 ${homeMoney}: ${result.value} ${travelMoney}</p>
    <p class='afterExchange'> ${travelMoney}: ${result.value}</p>
    <p class='date'>${result.update_at}</p>
    </section> 
    `;
  
    $('#travel-currency').html(converted);
    getExchange();
    $('#righthand-results').css('display','inline-block');
    //let outputElem = $('#righthand-results');
    //outputElem
      //.prop('hidden', false)
  }

  //Get amount of home currency the user wants to exchange
  function getExchange() {
    $('#js-homeland-currency-input').on('input', event => {
      let exchangeTotalAmount = event.currentTarget.value;
      let homeMoney = $('#js-home-currency').val();
      let travelMoney = $('#js-current-country').val();
      getDataFromApi(homeMoney, travelMoney, exchangeTotalAmount);
    })
  }

  //Function to submit home country & current country traveling in to move to next page
  function activateExchangeWindow() {
    $('.travelex').submit(event => {
      event.preventDefault();
      //Return currency symbol
      let homeMoney = $('#js-home-currency').val();
      let travelMoney = $('#js-current-country').val();
      getDataFromApi(homeMoney, travelMoney);
      $('.travelex').hide();
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

  //Autocomplete generator
  const autocomplete = new google.maps.places.Autocomplete(document.getElementById('js-current-location'));
  const places = new google.maps.places.PlacesService(map)
  autocomplete.addListener('place_changed', onPlaceChanged);

  //Zoom to map location based on location search
  function onPlaceChanged() {
    let place = autocomplete.getPlace();
    if (place.geometry) {
      map.panTo(place.geometry.location);
      map.setZoom(16);
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

  //Callback to search for banks in nearby bounds area
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

  //List banks on right-hand panel
  let li = document.createElement('li');
  li.innerHTML = `Bank: ${place.name} <br /> Address: ${place.vicinity}`;
  placesList.appendChild(li);
  li.onclick = function () {
    google.maps.event.trigger(marker, 'click');
    //Make markers bounce when clicking on right-hand panel 
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      marker.setAnimation(null);
      $(marker).dequeue();
    }, 1200);
  };

  //Create pop-up window over pin items to describe location name & address 
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name + "<br />" + place.vicinity);
    infowindow.open(map, this);
  });
  }

  function handleCreateApp() {
    activateExchangeWindow();
  }

  $(handleCreateApp);