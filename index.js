//Google Maps global variables
let map;
let infoWindow;
let autoComplete;
let places;

//Initiate Google Maps default map location
function initMap() {
    let defaultPosition = { lat: 43.766680, lng: 11.248663 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultPosition,
        zoom: 15
    });
    //Autocomplete generator
    autoComplete = new google.maps.places.Autocomplete(document.getElementById('js-current-location'));
    places = new google.maps.places.PlacesService(map);
}

//Get JSON
function getDataFromApi(homeMoney, travelMoney, exchangeTotalAmount) {
    if (exchangeTotalAmount !== undefined) {
        const settings = {
            'async': true,
            'crossDomain': true,
            'url': `https://api.labstack.com/currency/convert?from=${homeMoney}&to=${travelMoney}&value=1`,
            'method': 'GET',
            'headers': {
                'Authorization': 'Bearer 5qCpoR1yN5ePigTWl2G1kG5T5tX8fAuV',
                'Cache-Control': 'no-cache',
            },
            'success': function(data) { convertCurrency(data, homeMoney, travelMoney, exchangeTotalAmount) }
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
            'success': function(data) { convertCurrency(data, homeMoney, travelMoney, 1) }
        }
        $.ajax(settings2);
    }
}

//Create currency exchange display function
function convertCurrency(result, homeMoney, travelMoney, exchangeTotalAmount) {
    //Create variable for exchanged total amount  
    let exchangedTotal = result.value * exchangeTotalAmount;
    //Create variable for date & time of latest exchange rate data
    let date = moment(result.updated_at);
    let currentDate = date.tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss a z');     
    //Create currency exchange display
    let converted = `
    <section role='region' class='exchangeBlock'>
        <section role='region' class='currencyExchangeBlock'>
            <form role='form' class='exchangeTable'>
                <fieldset name='convertCurrency'>
                <legend>Currency Exchange</legend>
                <label for='js-homeland-currency-input' class='home_currency'>${homeMoney}</label>
                <input placeholder='1.00' type='number' name='js-homeland-currency-input' id='js-homeland-currency-input' autofocus/>
                <button role="button" type="submit" class="js-submit-currency">Submit</button>
                <p class='oneHomeToTravel'>(1 ${homeMoney}: ${result.value} ${travelMoney})</p>
                <p class='afterExchange'>${exchangeTotalAmount} ${homeMoney} = ${exchangedTotal} ${travelMoney}</p>
                <p class='date'>Exchange rate last updated: <br />${currentDate}</p>
                </fieldset>
            </form>
        </section> 
        <ul id="bank_places"></ul>
    </section>
    `;
    //Display left-hand panel with bank listings & addresses
    let outputElem = $('#left-panel');
    outputElem
        .prop('hidden', false)
        .html(converted);
    getExchange();
    onPlaceChanged();
}

//Get amount of home currency the user wants to exchange
function getExchange() {
    $('.exchangeTable').submit(event => {
        event.preventDefault();
        let exchangeTotalAmount = $('#js-homeland-currency-input').val();
        let homeMoney = $('#js-home-currency').val();
        let travelMoney = $('#js-current-country').val();
        getDataFromApi(homeMoney, travelMoney, exchangeTotalAmount);
    })
}

//Zoom to map location based on location search
function onPlaceChanged() {
    let place = autoComplete.getPlace();
    if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(16);
    }
    else if (!place.geometry) {
        window.alert("No results available for '" + place.name + "'");
        history.go(-1);
    }
    infowindow = new google.maps.InfoWindow();
    places.nearbySearch({
        location: place.geometry.location,
        bounds: map.getBounds(),
        type: ['bank']
    }, callback);


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

//List banks on left-hand panel
    let li = document.createElement('li');
    li.innerHTML = `Bank: ${place.name} <br /> Address: ${place.vicinity}`;
    placesList.appendChild(li);
    li.onclick = function() {
        google.maps.event.trigger(marker, 'click');
        //Make markers bounce when clicking on left-hand panel 
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
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
        $('.heading').hide();
    });
}

function handleCreateApp() {
    activateExchangeWindow();
}

$(handleCreateApp);