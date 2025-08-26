import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("Dehradun");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city) return; // Don't fetch if city is empty

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},India&appid=1e4ddb1a73a14e06da9a2f4e49b6bd99&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "404") {
          setError("City not found ❌");
          setWeather(null);
        } else {
          setWeather(data);
          setError("");
        }
      })
      .catch(() => {
        setError("Error fetching weather data ❌");
        setWeather(null);
      });
  }, [city]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Weather App 🌦️</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city..."
        style={{ padding: "8px", borderRadius: "5px", marginBottom: "1rem" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "1rem" }}>
          <h2>{weather.name}</h2>
          <p>🌡️ {weather.main.temp}°C</p>
          <p>☁️ {weather.weather[0].description}</p>
          <p>💨 Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
