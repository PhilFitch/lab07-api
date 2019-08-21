require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// API Service Dependecies
const weatherApi = require('./lib/weather-api');
const mapsApi = require('./lib/maps-api');

// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev'));
app.use(cors());

// Map (Google) API Route

app.get('/location', (request, response) => {
    try {
        const location = request.query.location;
        const result = getLatLng(location);
        response.status(200).json(result);
    } catch(err) {
        response.status(500).send('Sorry, something went wrong. Please try again');
    }
});

const geoData = require('./data/geo.json');

function getLatLng(/*location*/) {
    //api call will go here
    return toLocation(geoData);
}

function toLocation(/*geoData*/) {
    const firstResult = geoData.results[0];
    const geometry = firstResult.geometry;
    
    return {
        formatted_query: firstResult.formatted_address,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
    };
}

// Weather (darksky) API Route

app.get('/weather', (request, response) => {
    try {
        const weather = request.query.weather;
        const result = getForecast(weather);
        response.status(200).json(result);
    }

    catch(err) {
        // TODO: make an object and send via .json...
        response.status(500).send('Sorry something went wrong, please try again');
    }

});

function getForecast() {
    const forecast = [];

    for(let i = 0; i < weatherApi.daily.data.length; i++) {
        const dailyForecast = {
            forecast: weatherApi.daily.data[i].summary,
            time: weatherApi.daily.data[i].time
        };
        forecast.push(dailyForecast);
    }
    return forecast;
}

app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});