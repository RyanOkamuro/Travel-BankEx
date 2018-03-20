//Global variables for Google Maps
let map;


//Initiate Google Maps default map location
function initMap() {
  let defaultPosition = {lat: 34.019022, lng: -118.492806};
  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultPosition,
    zoom: 15
  });