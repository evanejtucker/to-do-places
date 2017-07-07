
$(document).ready(function(){


//====================FIREBASE DATABASE====================


var config = {
	   apiKey: "AIzaSyDaDxv9jNfNhEd7stk340f8FJqDo7iOtSg",
	   authDomain: "to-do-places.firebaseapp.com",
	   databaseURL: "https://to-do-places.firebaseio.com",
	   projectId: "to-do-places",
	   storageBucket: "to-do-places.appspot.com",
	   messagingSenderId: "329838193586"
	 };
	 firebase.initializeApp(config);
var database = firebase.database();
var userId;

firebase.auth().onAuthStateChanged(function(firebaseUser) {
	if(firebaseUser) {
    userId = firebaseUser.uid;
		console.log("Firebase User", userId);
    database.ref(userId).on("child_added", function(snapshot) {
	    var a = snapshot.val();
      renderPlace(a)
    });
	} else {
		console.log("no User Signed In Using LocalStorage");
    var items = storage('user_items').get()
    for (var i = 0; i < items.length; i++) {
      renderPlace(items[i]);
    }
	}
});

//====================GLOBAL VARIABLES====================


var map;
var center = new google.maps.LatLng(39.7392, -104.990);
var infoWindow;
var radius = 8050;

var routeWaypts = [];
var viewWaypts = [];
var places = [];
var placesLoc = [];
var markers = [];
var typeSelection = 'cafe';
var selectedKeyword;
var startLocation;
var endLocation;


//====================DEFAULT MAP====================


var defaultMap = {
	initialize: function() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: center,
			zoom: 3
		});
	}
}

var viewPlacesMap = {
	initialize: function() {
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 11,
			center: center,
		});
		var infowindow = new google.maps.InfoWindow({
			content: "hello"
		});
		for (var i = 0; i < placesLoc.length; i++) {
			var marker = new google.maps.Marker({
				position: placesLoc[i],
				map: map,
				title: 'Hello World!'
			});
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
		}			
	}
}


//====================NEW MAP====================


var newMap = {
	initialize: function() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: center,
			zoom: 11
		});
        var request = {
        	location: center,
        	radius: radius,
        	types: [typeSelection],
        	keyword: [selectedKeyword]
        };

        infoWindow = new google.maps.InfoWindow( {

        });
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, newMap.callback);
		google.maps.event.addListener(map, 'rightclick', function(event) {
			waypoints.clearMarkers(markers)
			var request = {
				location: event.latLng,
				radius: radius,
				types: [typeSelection],
				keyword: [selectedKeyword]
			};
			center = event.latLng;
			newMap.initialize();
			service.nearbySearch(request, newMap.callback);
		})
		newMap.mapCircle();
	},
	callback: function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				markers.push(waypoints.createMarker(results[i]));
			}
		}
	},
	setType: function () {
		typeSelection = $(this).attr("val");
		selectedKeyword = null;
		newMap.initialize();
	},
	mapCircle: function() {
		var circle = new google.maps.Circle({
			center: center,
			map: map,
			radius: radius,
			fillOpacity: 0,
			strokeColor: "red",
			strokeWeight: 1
		});
	}
}




//====================WAYPOINTS / MARKERS====================


var waypoints = {
	createMarker: function (place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});

		google.maps.event.addListener(marker, 'click', function() {
			var infoContent = "<div id='infoWindow'>"
			+"<div id='infoHeader'>"+place.name+"</div>"
			+"<hr>"
			+"<span>"
			+"<button class='btn btn-success add' id='add'> Add to List </button>"
			+"<button class='btn btn-info add' id='start'> Set Start Location </button>"
			+"<button class='btn btn-warning add' id='end'> Set End Location </button>"
			+"</span>"
			+"</div>";
			infoWindow.setContent(infoContent);
			infoWindow.open(map, this);
			$(".add").on("click", function() {
				addPlaceToDb({
					placeID: place.place_id,
					placeName: place.name
				})
				placesLoc.push(place.geometry.location);
				markers.splice();
				waypoints.clearMarkers(markers);
			});
			$("#start").on("click", function() {
				startLocation = place.place_id;
				console.log(startLocation);
			});
			$("#end").on("click", function() {
				endLocation = place.place_id;
				console.log(endLocation);
			});
		});
		return marker;
	},
	clearMarkers: function (markers) {
		for (var m in markers) {
			markers[m].setMap(null)
		}
		markers = []
	}
}


//====================BUTTONS====================


var buttons = {
	mapIt: function() {
		for (var i = 0; i < places.length; i++) {
			viewWaypts[i] = places
		}
	},
	makeRoute: function() {
		for (var i = 0; i < places.length; i++) {
			routeWaypts[i] = {
				stopover: true,
				location: {'placeId': places[i]}
			};
		}
		var map = new google.maps.Map(document.getElementById("map"));
		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer({
			map: map
		});
		directionsService.route({
			origin: {
				'placeId': startLocation
			},
			destination: {
				'placeId': endLocation
			},
			waypoints: routeWaypts,
			optimizeWaypoints: true,
			travelMode: google.maps.TravelMode.DRIVING
		},
		function(response, status) {
			if (status === 'OK') {
				directionsDisplay.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	},
	submitPlace: function () {
		selectedKeyword = $("#placeInput").val();
		typeSelection = null;
		newMap.initialize();
	},
	removeDatabasePlaces: function () {
		database.ref().remove();
		localStorage.clear();
		$('.listItem').empty();
		placesLoc = [];
		places = [];
		waypts = [];
		defaultMap.initialize();
	},

}

locationCheck = function() {
	if (!startLocation && !endLocation) {
		alert("Please Selected A start Location and an End Location")
		defaultMap.initialize();
	}
	else if (!startLocation) {
		alert("please select a start location");
		defaultMap.initialize();
	}
	else if (!endLocation) {
		alert("please select and end location");
		defaultMap.initialize();
	}
}

//====================CLICK EVENTS====================
$('#myForm input').on('change', function() {
   var radiusValue = ($('input[name=radius]:checked', '#myForm').val());
   radius = Number(radiusValue);
   newMap.initialize();
});

$("#makeRoute").on("click", buttons.makeRoute);

$(".nav-item").on("click", newMap.setType);

$("#mapIt").on("click", viewPlacesMap.initialize);

$("#submit").on("click", buttons.submitPlace);

$("#clear").on("click", buttons.removeDatabasePlaces);

$("#userSubmit").on("click", buttons.setUserLocation);



google.maps.event.addDomListener(window, 'load', defaultMap.initialize);

function renderPlace (place) {
  $(".listItem").prepend("-" + place.placeName + "<br>");
  places.push(place.placeID);
}

function addPlaceToDb (place) {
  if (userId) {
    database.ref(userId).push(place)
  } else {
    storage('user_items').add(place)
    renderPlace(place)
  }
}


function storage (name) {

  function get () {
    var data = localStorage.getItem(name);
    if (data) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  return {
    add: function (item) {
      var data = get()
      data.push(item)
      localStorage.setItem(name, JSON.stringify(data))
      return data
    },
    get: get
  }
}
});
