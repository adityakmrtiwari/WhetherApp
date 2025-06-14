import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

// Weather condition codes to icon mapping
const weatherIcons = {
  // Clear
  1000: 'clear',
  // Partly cloudy
  1003: 'partly-cloudy',
  // Cloudy
  1006: 'cloudy',
  1009: 'cloudy',
  // Rain
  1063: 'rain',
  1180: 'rain',
  1186: 'rain',
  1189: 'rain',
  1192: 'rain',
  1195: 'rain',
  // Snow
  1066: 'snow',
  1210: 'snow',
  1213: 'snow',
  1216: 'snow',
  1219: 'snow',
  1222: 'snow',
  1225: 'snow',
  // Thunder
  1087: 'thunder',
  1273: 'thunder',
  1276: 'thunder',
  // Fog/Mist
  1030: 'fog',
  1135: 'fog',
  1147: 'fog',
  // Wind
  1007: 'wind',
  1008: 'wind',
};

export const getWeatherIcon = (code) => {
  return weatherIcons[code] || 'clear';
};

export const getCurrentLocation = async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: `${latitude},${longitude}`,
        aqi: 'yes',
      },
    });

    return {
      name: response.data.location.name,
      country: response.data.location.country,
      lat: latitude,
      lon: longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    // Default to London if geolocation fails
    return {
      name: 'London',
      country: 'United Kingdom',
      lat: 51.5074,
      lon: -0.1278,
    };
  }
};

export const searchLocations = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: query,
      },
    });

    return response.data.map(location => ({
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

export const fetchWeatherData = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: `${location.lat},${location.lon}`,
        days: 7,
        aqi: 'yes',
        alerts: 'yes',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}; 