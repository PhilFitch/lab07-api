require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// API Service Dependecies
const weatherApi = require('./lib/weather-api');
const mapsApi = require('./lib/maps-api');
const eventbriteApi = require('./lib/eventbrite-api');

// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev'));
app.use(cors());

// Map (Google) API Route
app.get('/location', (request, response) => {
    const search = request.query.search;
    console.log(search);
    mapsApi.getLocation(search)
        .then(location => {
            response.json(location);
        })
        .catch(err => {
            response.status(500).json({
                error: err.message || err
            });
        });
});

// Weather (darksky) API Route
app.get('/weather', (request, response) => {
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;

    weatherApi.getForecast(latitude, longitude)
        .then(forecast => {
            response.json(forecast);
        })
        .catch(err => {
            response.status(500).json({
                error: err.message || err
            });
        });
});

// Eventbrite API Route
app.get('/events', (request, response) => {
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;

    eventbriteApi.getEvents(latitude, longitude)
        .then(events => {
            response.json(events);
        })
        .catch(err => {
            response.status(500).json({
                error: err.message || err
            });
        });
});

// Yelp API Route


app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});