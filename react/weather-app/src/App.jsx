import React, { useEffect, useState } from "react";
import Header from "./components/Header";


const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const App = () => {
  const [user, setUser] = useState("");
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState("");
  const [inputCity, setInputCity] = useState("");
  
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(savedUser);
      const savedCity = localStorage.getItem(`city_${savedUser}`);
      if (savedCity) {
        setCity(savedCity);
        fetchWeather(savedCity);
      } else {
        getUserLocation();
      }
    }
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const fetchWeather = async (queryCity) => {
    try {
      const url = `https://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${queryCity}`;
      const response = await fetch(url);
      const result = await response.json();
      setWeather(result);
      speak(`The weather in ${queryCity} is ${result.current.temperature} degrees Celsius.`);
    } catch (error) {
      console.error("Weather fetch error:", error);
    }
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(lat,lon)
        fetch(`https://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${lat},${lon}`)
          .then((res) => res.json())
          .then((data) => {
            setWeather(data);
            setCity(data.location.name);
            speak(`The weather in ${data.location.name} is ${data.current.temperature} degrees Celsius.`);
          });
      },
      (err) => console.error("Geolocation error:", err)
    );
  };

  const handleSignUp = (username, password) => {
    if (localStorage.getItem(`user_${username}`)) {
      alert("User already exists");
    } else {
      localStorage.setItem(`user_${username}`, password);
      sessionStorage.setItem("user", username);
      setUser(username);
    }
  };

  const handleSignIn = (username, password) => {
    const savedPassword = localStorage.getItem(`user_${username}`);
    if (savedPassword === password) {
      sessionStorage.setItem("user", username);
      setUser(username);
      const savedCity = localStorage.getItem(`city_${username}`);
      if (savedCity) {
        setCity(savedCity);
        fetchWeather(savedCity);
      } else {
        getUserLocation();
      }
    } else {
      alert("Invalid credentials");
    }
  };

  const handleSearch = () => {
    setCity(inputCity);
    setWeather("");
    localStorage.setItem(`city_${user}`, inputCity);
    fetchWeather(inputCity);
  };

  const handleSpeechInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
      const spokenCity = event.results[0][0].transcript;
      setInputCity(spokenCity);
      setCity(spokenCity);
      localStorage.setItem(`city_${user}`, spokenCity);
      fetchWeather(spokenCity);
    };
    recognition.start();
  };

  return (
    <div>
      <Header></Header>
    <div className="p-1 font-sans grid justify-center justify-items-center ">
      {!user ? (
        <div className=" bg-slate-900 p-10 grid max-w-2xl w-96 text-white text-center gap-3 mt-20 rounded-2xl shadow-md ">
          <h2 className="text-xl font-bold">Sign In / Sign Up</h2>
          <input type="text" placeholder="Username" id="username" className=" p-2 border-b border-b-gray-700 m-1" />
          <input type="password" placeholder="Password" id="password" className=" p-2 border-b border-b-gray-700 m-1" />
          <button onClick={() => handleSignIn(document.getElementById("username").value, document.getElementById("password").value)} className="border px-4 py-2 rounded-l rounded-r m-1 cursor-pointer hover:bg-gray-900 hover:text-gray-100 ">Sign In</button>
          <button onClick={() => handleSignUp(document.getElementById("username").value, document.getElementById("password").value)} className="border px-4 py-2 rounded-l rounded-r m-1 cursor-pointer hover:bg-gray-900 hover:text-gray-100 ">Sign Up</button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl mb-2 text-center mt-4">Welcome, {user}</h2>
          <input
            type="text"
            placeholder="Enter city"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            className=" p-2 border-b border-b-gray-700 m-1 mt-10"
          />
          <button onClick={handleSearch} className="border px-4 py-2 rounded-l rounded-r m-1 cursor-pointer hover:bg-gray-900 hover:text-gray-100 ">Search</button>
          <button onClick={handleSpeechInput} className="border px-4 py-2 rounded-l rounded-r m-1 cursor-pointer hover:bg-gray-900 hover:text-gray-100 ">🎤 Speak City</button>
          {!weather ? (<div className="mt-4 p-7 border-1 grid justify-center justify-items-center gap-2 border-gray-400 bg-gray-200 text-center rounded shadow-md">
            <h3 className="text-lg font-medium">Loading...</h3>

          </div>):(
            <div className="mt-4 p-7 border-1 grid justify-center justify-items-center gap-2 border-gray-400 bg-gray-200 text-center rounded shadow-md">
              <h3 className="text-lg font-medium">Weather in {weather.location.name}</h3>
              <p>Temperature: {weather.current.temperature} °C</p>
              <p>Condition: {weather.current.weather_descriptions[0]}</p>
              <img src={weather.current.weather_icons[0]} alt="Weather icon" />
            </div>
          )}
          <div className="grid justify-items-center ">
            <button onClick={()=>{setUser("")}} className="border px-4 py-2 rounded-l rounded-r m-1 mt-10 cursor-pointer hover:bg-gray-900 hover:text-gray-100 ">LogOut</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default App;
