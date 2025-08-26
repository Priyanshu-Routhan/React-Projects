import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [city, setCity] = useState("Dehradun, India");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Dehradun,India&appid=1e4ddb1a73a14e06da9a2f4e49b6bd99&units=metric`
    )
      .then(res => res.json())
      .then(data => setWeather(data));
  }, [city]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Weather App 🌦️</h1>
      <input
        type="text"
        value={city} 
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city..."
      />
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>🌡️ {weather.main.temp}°C</p>
          <p>☁️ {weather.weather[0].description}</p>
          <p>💨🍃 {weather.wind.speed}</p>

        </div>
      )}
    </div>
  )
}

export default App
