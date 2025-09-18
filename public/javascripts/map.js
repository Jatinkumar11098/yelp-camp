maptilersdk.config.apiKey = mapAPI;

        const map = new maptilersdk.Map({
            container: 'map', // container's id or the HTML element in which the SDK will render the map
            style: maptilersdk.MapStyle.STREETS,
            center: campground.geometry.coordinates, // starting position [lng, lat]
            zoom: 14 // starting zoom
        });