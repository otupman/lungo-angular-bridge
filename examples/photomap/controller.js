function AppCtrl($scope) {
    $scope.triggerAside = function() {
        Lungo.Router.aside('main', 'aside1');
    }
}

function MapCtrl($scope) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $scope.map = new google.maps.Map(document.getElementById('map_container'), {
        zoom: 15,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      $scope.locationMarker = new google.maps.Marker({
        position: latLng,
        title: "You are here"
      }).setMap($scope.map);

    });
}

function PhotoCtrl($scope) {
    $scope.takePhoto = function() {
        navigator.camera.getPicture(function(imgUri) {
            var image = document.getElementById("photo");
            image.src = imgUri;
        }, function() {
            navigator.notification.alert("Photo fail :(", null, "Oh noes!", "I can cope with it");
        }, {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI
        });
    }
}