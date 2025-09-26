maptilersdk.config.apiKey = mapAPI;

const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element in which the SDK will render the map
    style: maptilersdk.MapStyle.STREETS,
    center: campgrounds.geometry.coordinates, // starting position [lng, lat]
    zoom: 14 // starting zoom
});

new maptilersdk.Marker()
    .setLngLat(campgrounds.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campgrounds.title}</h3><p>${campgrounds.location}</p>`
            )
    )
    .addTo(map)