
        //   let mapToken = "<%=process.env.MAP_TOKEN%>"; 

// const Listing = require("../../models/listing.js");

     //  let mapToken = mapToken; 
    mapboxgl.accessToken = mapToken;

            const map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v12', // style URL
                center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
                zoom: 6 // starting zoom
            });
       
    

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color:"red"})
          .setLngLat(coordinates)
          //listing.geometry.coordinates
          .setPopup(new mapboxgl.Popup({offset:25 })
                .setHTML(`<h1>${listing.title}</h1><p>exact location provided after booking </p>`))
          .addTo(map);