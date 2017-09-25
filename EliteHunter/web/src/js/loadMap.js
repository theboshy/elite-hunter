var imagePath = "./src/images/position_icon_nor.png";
//se_supone_que_deje_de_regalar_mi_api_pero_no_puedo
var API_KEY = "https://developers.google.com/maps/documentation/javascript/get-api-key?hl=ES#key";
var posicion;
$(document).ready(function initParameters() {
    //--
    var configOptions = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 1000
    };

    if (navigator.geolocation) {
        secureProtocol();
        initGoogleApi();
        buffered();
        //obtiene la posicion cada ves que el esta cambia
        navigator.geolocation.watchPosition(bunnyTarget, errorsHandler, configOptions);
        //obtiene la posicion actual (al ejecutar el codigo)
        //navigator.geolocation.getCurrentPosition(bunnyTarget);
    } else {
        alert("su sistema no soporta geolocalizacion :/");
    }
});

function bunnyTarget(position) {
    if (typeof google === "undefined") {
        alert("Asegurese de integrar correctamente el API de google maps o revise su API_KEY");
    } else {
        posicion = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        map = new google.maps.Map(document.getElementById('map'), {
            center: posicion,
            zoom: 18
        });

        marker = new google.maps.Marker({
            position: posicion,
            map: map,
            icon: imagePath,
            title: 'su ubicacion actual'
        });

        infowindow = new google.maps.InfoWindow({
            content: 'Lugar de caeria',
            maxWidth: 500
        });

        addEventListeners();
    }
    reverseGeocoding(position.coords.latitude, position.coords.longitude);
}

function addEventListeners() {
    //click sobre el marcador
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });

    //cambio de tamaño de la ventana
    google.maps.event.addDomListener(window, "resize", function () {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    //al separarse el mapa y el marcador volver al marcador
    map.addListener('center_changed', function () {
        window.setTimeout(function () {
            map.panTo(marker.getPosition());
        }, 3000);
    });
}

function secureProtocol() {
    var path = window.location.href.replace("http", "https");
    window.location.href = path.replace("8080", "8181");
}
function unSecureProtocol() {
    //el reverso (luchador)
    var path = window.location.href.replace("https", "http");
    window.location.href = path.replace("8181", "8080");
}

function initGoogleApi() {
    var referencia = $("<script>", {
        src: "https://maps.googleapis.com/maps/api/js?key=" + API_KEY,
        async: "true",
        defer: "true"
    });

    $("body").append(referencia);
}

function buffered() {
    var req = new XMLHttpRequest();
    req.onprogress = updateProgress;
    req.open('GET', window.location, true);
    req.send();

    function updateProgress(evt) {
        if (evt.lengthComputable) {
            if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                //console.log(percentComplete);
                $('.progress').css({
                    width: percentComplete * 100 + '%'
                });
            }
        }
    }
}

function errorsHandler(error) {
    var msg = "";
    var documentId = "image_generic";
    var documentImage = "./src/images/errors/";
    switch (error.code) {
        case 1 :
        {
            msg = "Debe permitir el uso de geolocalizacion para continuar";
            documentImage += "lost_conection.png";
            break;
        }
        case 2 :
        {
            msg = "Es imposible obtener la ubicacion actual";
            documentImage += "lost_directions.png";
            break;
        }
        case 3:
        {
            msg = "Se ha agotado el tiempo de espera para obtener la ubicación";
            documentImage += "lost.png";
            break;
        }
    }
    alert(msg);
    document.getElementById("error_image").style.display = "block";
    document.getElementById("error_image_lost_conection_msg").innerHTML = msg;
    document.getElementById(documentId).src = documentImage;
}

function getApiKeyFromServlet() {
    $.get("ApiKeyServlet", function (response) {
        alert("llave del api desde el servlet" + response);
    });
}

//trazar una ruta desde la ubicacion actual a la ubicacion requerida
function setNewDestination(lati, longit) {
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    var request = {
        destination: new google.maps.LatLng(lati, longit),
        origin: posicion,
        travelMode: 'DRIVING'
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            alert("Ocurrio un error al intentar trazar la ruta : " + response);
        }
    });
}

function reverseGeocoding(latitud, longitud) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitud + ',' + longitud + '&key=' + API_KEY,
        //async: false,
        success: function (response) {
            var responseSources = response.results[0];
            console.log("latitud : " + latitud + "\n longitud : " + longitud + "\n direccion fisica : " + responseSources.formatted_address +"\n pais : "+responseSources.address_components[responseSources.address_components.length-2].long_name +"\n ciudad : "+responseSources.address_components[responseSources.address_components.length-3].long_name);
        },
        error: function (jqXHR, exception) {
            alert("error : " + exception);
        }
    });

}
