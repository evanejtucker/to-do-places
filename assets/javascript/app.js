var map;
		var infoWindow;

		var request;
		var service;
		var markers = [];
		var typeSelection = 'cafe';

		function initialize() {
			var center = new google.maps.LatLng(39.7392, -104.9903);
			map = new google.maps.Map(document.getElementById('map'), {
				center: center,
				zoom: 13
			});
			request = {
				location: center,
				radius: 8047,
				types: ['cafe']
			};
			infoWindow = new google.maps.InfoWindow();

			service = new google.maps.places.PlacesService(map);

			service.nearbySearch(request, callback);

			google.maps.event.addListener(map, 'rightclick', function(event) {
				map.setCenter(event.latLng)
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
				infoWindow.setContent(place.name);
				infoWindow.open(map, this);
        		console.log(place.place_id);
			});
			return marker;
		}

		function clearResults(markers) {
			for (var m in markers) {
				markers[m].setMap(null)
			}
			markers = []
		}

		google.maps.event.addDomListener(window, 'load', initialize);