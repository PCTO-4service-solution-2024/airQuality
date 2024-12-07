let map;
const aqiDesc = ["Low", "Moderate", "High", "Very High", "Extreme"];
const url = "http://127.0.0.1:3000";
let marker = null;
async function input2() {

    const city = document.getElementById("city").value;
    if(city == ""){
        alert("Insert a city");
        return;
    }

    const coords = await getCoords(city);
    if(coords == null){
        alert("Error in city request");
        return;
    }
    document.getElementById("coords").innerHTML = `Coords: ${coords.lat}, ${coords.lon}`;
    console.log(coords);

    creaMappa(parseFloat(coords.lat), parseFloat(coords.lon));
    
    const data = await requestData(coords.lat, coords.lon);
    if(data == null){
        alert("Error in data request");
    }
    console.log(data);
    setdata(data);
}

async function getCoords(city) {
    const url = `https://nominatim.openstreetmap.org/search?q=${city}&format=json`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`request error! status: ${response.status}`);
    }
    const data = await res.json();
    if(data.length == 0){
        alert("City not found");
        return null;
    }
    // console.log(data);
    return { "lat": data[0].lat, "lon": data[0].lon };

}

function getDataFromHtml() {
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;
    return { "lat": lat, "lon":lon };
}

function creaMappa(lat, lon) {
    if (map) {
        map.setView([lat, lon], 15);
    } else {
        map = L.map('map').setView([lat, lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }
    if(marker != null){
        marker.remove();
    }
    marker = L.marker([lat, lon]).addTo(map); 
}
async function requestData(lat, lon) {
    const url1 = url+`/getData/${lat}/${lon}`;
    try {
        const response = await fetch(url1);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();;
    } catch (error) {
        console.error('Error requesting API or database:', error);
    }
    return null;
}

function setdata(data){
    if (data.qualityLevel != null) {
        //document.getElementById("level").innerHTML = data.qualityLevel;
        document.getElementById("aqi").innerHTML = data.qualityLevel;
        document.getElementById("aqiDesc").innerHTML = aqiDesc[data.qualityLevel-1];

    }

    if (data.co != null) {
        document.getElementById("co").innerHTML = data.co;
    }

    if(data.no != null){
        document.getElementById("no").innerHTML = data.no;
    }

    if(data.no2 != null){
        document.getElementById("no2").innerHTML = data.no2;
    }

    if(data.o3 != null){
        document.getElementById("o3").innerHTML = data.o3;
    }

    if(data.so2 != null){
        document.getElementById("so2").innerHTML = data.so2;
    }

    if(data.pm2_5 != null){
        document.getElementById("pm2_5").innerHTML = data.pm2_5;
    }

    if(data.pm10 != null){
        document.getElementById("pm10").innerHTML = data.pm10;
    }

    if(data.nh3 != null){
        document.getElementById("nh3").innerHTML = data.nh3;
    }
}
