var imagePath = "sources/images/position_icon_nor.png";
var posicion;
$(document).ready(function initParameters() {
    //secureProtocol();

    //--
    var configOptions = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 1000
    };

    if (navigator.geolocation) {
        //obtiene la posicion cada ves que esta cambia
        navigator.geolocation.watchPosition(bunnyTarget, errorsHandler, configOptions);
        //obtiene la posicion actual
        //navigator.geolocation.watchPosition(bunnyTarget);
        initGoogleApi();
        buffered();
    } else {
        alert("su sistema no soporta geolocalizacion :/");
    }

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
    }

});

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

    //al separarse el mapa y el marcador volver al marcador inicial despues de 3 s
    map.addListener('center_changed', function () {
        window.setTimeout(function () {
            map.panTo(marker.getPosition());
        }, 5000);
    });
}

function secureProtocol() {
    var path = window.location.href.replace("http", "https");
    //TODO: hacerlo dinamico
    window.location.href = path.replace("1010", "1010");
}

function initGoogleApi() {
    var API_KEY = "<API_KEY>";

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
    var documentImage = "sources/images/errors/";
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
