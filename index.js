// Get user's location
async function getCoords() {
    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    
    return[position.coords.latitude, position.coords.longitude]
}

// Build map centered on user's location
function buildMap(latitude, longitude) {
    // Create map centered on user's location
    let map = L.map('map').setView([latitude, longitude], 11);

    // Add tile layer to map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: '12',
    }).addTo(map)

    // Add marker at user's location
    let marker = L.marker([latitude, longitude])
    marker.addTo(map).bindPopup('<p1><b>You Are Here</b></p1>').openPopup()
    return map
}

// Define options for GET request
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'fsq3LyDUDnx37Kwmde5sXFNxnX8XYO/JB+WDyCdQUQPoC4g='
    }
};

// Search for 5 locations with a query at a given latitude and longitude
async function queryFourSquare(query, latitude, longitude) {
    return fetch(`https://api.foursquare.com/v3/places/search?&query=${query}&limit=5&ll=${latitude}%2C${longitude}`, options)
    .then(response => response.json())
    .catch(err => console.error(err));
}

// Add a set of markers to a map
function addResultsToMap(map, results, markerList) {
    results.forEach(result => {
        let marker = L.marker([result.geocodes.main.latitude, result.geocodes.main.longitude])
        marker.addTo(map)
        markerList.push(marker)
    }) 
}

getCoords()
.then(position => {
    const [latitude, longitude] = position
    const myMap = buildMap(latitude, longitude)
    const markers = []

    const selection = document.getElementById('business-type')
    selection.addEventListener('change', (e) => {
        // Clear all markers on the map
        while (markers.length > 0) {
            markers.pop().remove()
        }

        // If the user chose the blank option
        if (e.target.value === 'NULL') return

        // For any other option, display the query results on the map
        queryFourSquare(e.target.value, latitude, longitude)
        .then(response => {
            addResultsToMap(myMap, response.results, markers)
        })
    })
})


  

