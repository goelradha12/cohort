Task: Weather App with Sign-In/Sign-Up and Speech Synthesis - no backend
Objective: Create a weather app that simulates a sign-in/sign-up process, fetches weather data based on the user’s location or a saved city, and uses speech synthesis to read the place aloud and automatically fill the search bar with that place.
Features to Implement:
Sign-Up / Sign-In Simulation:


Store the user’s username and password in localStorage (simulating registration).


Track the login session using sessionStorage. If logged in, greet the user (e.g., "Welcome, [username]").


Geolocation:


geolocation to get the user’s current location (latitude and longitude).


Fetch weather data from a weather API like OpenWeatherMap using this location.


Weather Data:


Display the current weather based on either the user's geolocation or a city they’ve saved to localStorage.


Allow the user to input and save their preferred city to localStorage.


Speech Synthesis:


Use the speechSynthesis API to read out the city and weather details (e.g., "The current temperature in [city] is [temp]°C with [condition].").


Automatically fill the search bar with the place name that is spoken.


Goal:
Create a weather app that:
Simulates a sign-in/sign-up process using localStorage for credentials and sessionStorage for tracking the session.


Fetches and displays weather data based on the user’s geolocation or saved city.


Uses speech synthesis to announce the weather information and fill the search bar with the spoken place.
