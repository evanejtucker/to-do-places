
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
var waypts = [];

var request;
var service;
var markers = [];
var typeSelection = 'liquor_store';
var selectedKeyword;
var selectedMarkers = [];
var places = [];


//====================Initialize places map====================

function initialize() {
	var center = new google.maps.LatLng(39.7392, -104.9903);
	map = new google.maps.Map(document.getElementById('map'), {
		center: center,
		zoom: 13
	});
	request = {
		location: center,
		radius: 8047,
		types: [typeSelection],
		keyword: [selectedKeyword]
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
				placeID: place.place_id,
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
	selectedKeyword = null;
	initialize();
}

function grabWaypoints() {
	for (var i = 0; i < places.length; i++) {
		waypts[i] = {	
				stopover: true,
				location: {'placeId': places[i]}	
		};
	}
	console.log(waypts);
}

function mapIt() {
	grabWaypoints();
	var map = new google.maps.Map(document.getElementById("map"));
	var directionsService = new google.maps.DirectionsService();

	var directionsDisplay = new google.maps.DirectionsRenderer({
		map: map
	});

	directionsService.route({
		origin: {
			'placeId': 'ChIJ43izIC2Fa4cR-MengeK0-DI'
		},
		destination: {
			'placeId': 'ChIJFb1AJWd_bIcRFEQ1TXQooQQ'
		},
		waypoints: waypts,
		optimizeWaypoints: true,
		travelMode: google.maps.TravelMode.DRIVING
	}, function(response, status) {
		if (status === 'OK') {
			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}

function submitPlace() {
	selectedKeyword = $("#placeInput").val();
	typeSelection = null;
	initialize();
}

$(".nav-item").on("click", setType);

database.ref().on("child_added", function(snapshot) {
	var a = snapshot.val();
	$(".listItem").prepend("-" + a.placeName + "<br>");
	places.push(a.placeID);
});

$("#mapIt").on("click", mapIt);

$("#submit").on("click", submitPlace);

google.maps.event.addDomListener(window, 'load', initialize);
});
