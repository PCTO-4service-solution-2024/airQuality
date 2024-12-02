const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

function formatData(dict) {
    return{
        "coord": dict.coord,
        "qualityLevel": dict.list[0].main.aqi,
        "co": dict.list[0].components.co,
        "no": dict.list[0].components.no,
        "no2": dict.list[0].components.no2,
        "o3": dict.list[0].components.o3,
        "so2": dict.list[0].components.so2,
        "pm2_5": dict.list[0].components.pm2_5,
        "pm10": dict.list[0].components.pm10,
        "nh3": dict.list[0].components.nh3,
    }
}

app.get('/getData/:lat/:lon', async (req, res) => {
    const { lat, lon } = req.params;
    const api_key = 'b8979e870406e434dd8fd3191213799e';
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data_city = await response.json();
        res.json(formatData(data_city));
    } catch (error) {
        console.error('Error fetching city data:', error);
        res.status(500).send('Error fetching city data');
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});