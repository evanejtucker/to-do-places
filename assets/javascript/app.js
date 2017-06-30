
$(document).ready(function(){

var config = {
	   apiKey: "AIzaSyDaDxv9jNfNhEd7stk340f8FJqDo7iOtSg",
	   authDomain: "to-do-places.firebaseapp.com",
	   databaseURL: "https://to-do-places.firebaseio.com",
	   projectId: "to-do-places",
	   storageBucket: "to-do-places.appspot.com",
	   messagingSenderId: "329838193586"
	 };
	 firebase.initializeApp(config);

var auth = firebase.auth();
var map;
var infoWindow;
var database = firebase.database();

var request;
var service;
var markers = [];
var typeSelection = 'liquor_store';
var selectedMarkers = [];
var places = [];


function initialize() {
	var center = new google.maps.LatLng(39.7392, -104.9903);
	var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
	map = new google.maps.Map(document.getElementById('map'), {
		center: center,
		zoom: 13
	});
	request = {
		location: center,
		radius: 8047,
		types: [typeSelection]
	};
	infoWindow = new google.maps.InfoWindow();

	service = new google.maps.places.PlacesService(map);

	service.nearbySearch(request, callback);

	google.maps.event.addListener(map, 'rightclick', function(event) {
		clearResults(markers)

		var request = {
			location: event.latLng,
			radius: 5000,
			types: ['cafe']
		};
		service.nearbySearch(request, callback);
	})

}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			markers.push(createMarker(results[i]));
		}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.setContent(place.name + "<br>" + "<button class='add'>Add to List</button>" );
		infoWindow.open(map, this);
		$(".add").on("click", function() {
			database.ref().push({
				placeID: place.id,
				placeName: place.name
			});
			markers.splice();
			clearOtherMarkers(markers);
		});
	});
	return marker;
}

function clearOtherMarkers(markers) {
	for (var m in markers) {
		markers[m].setMap(null)
	}
	markers = [];
}

function clearResults(markers) {
	for (var m in markers) {
		markers[m].setMap(null)
	}
	markers = []
}

function setType() {
	typeSelection = $(this).attr("val");
	initialize();
}

function mapIt() {
	console.log("test");
}



$(".nav-item").on("click", setType);

database.ref().on("child_added", function(snapshot) {
	var a = snapshot.val();
	$(".listItem").prepend("-" + a.placeName + "<br>");
	places.push(a.placeID);
});

$("#mapIt").on("click", mapIt);

google.maps.event.addDomListener(window, 'load', initialize);
});
