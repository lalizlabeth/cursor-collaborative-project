"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface ForecastDay {
  date: string;
  temp: number;
  icon: string;
  description: string;
}

export function WeatherApp() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [city, setCity] = useState("New York");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError("");
    
    try {
      // Fetch current weather
      const weatherRes = await fetch(
        `/api/weather/current?city=${encodeURIComponent(cityName)}`
      );
      
      if (!weatherRes.ok) {
        const errorData = await weatherRes.json().catch(() => null);
        const errorMessage =
          errorData?.message || errorData?.error || "City not found";
        throw new Error(errorMessage);
      }
      
      const weatherData = await weatherRes.json();
      
      setWeather({
        temp: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed),
        icon: weatherData.weather[0].icon,
      });

      // Fetch 7-day forecast
      const forecastRes = await fetch(
        `/api/weather/forecast?city=${encodeURIComponent(cityName)}`
      );
      
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        
        // Process forecast data - get one forecast per day at noon
        const dailyForecasts: ForecastDay[] = [];
        const processedDates = new Set();
        
        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateString = date.toLocaleDateString();
          
          // Get the forecast around noon (12:00) for each day
          if (!processedDates.has(dateString) && date.getHours() >= 11 && date.getHours() <= 13) {
            processedDates.add(dateString);
            dailyForecasts.push({
              date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
              temp: Math.round(item.main.temp),
              icon: item.weather[0].icon,
              description: item.weather[0].description,
            });
          }
        });
        
        setForecast(dailyForecasts.slice(0, 7));
      }
      
      setCity(cityName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("New York");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
      setSearchInput("");
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      "01d": "pixelarticons:sun",
      "01n": "pixelarticons:moon",
      "02d": "pixelarticons:cloud-sun",
      "02n": "pixelarticons:cloud-moon",
      "03d": "pixelarticons:cloud",
      "03n": "pixelarticons:cloud",
      "04d": "pixelarticons:cloud",
      "04n": "pixelarticons:cloud",
      "09d": "pixelarticons:rain",
      "09n": "pixelarticons:rain",
      "10d": "pixelarticons:rain",
      "10n": "pixelarticons:rain",
      "11d": "pixelarticons:lightning",
      "11n": "pixelarticons:lightning",
      "13d": "pixelarticons:snow",
      "13n": "pixelarticons:snow",
      "50d": "pixelarticons:fog",
      "50n": "pixelarticons:fog",
    };
    return iconMap[iconCode] || "pixelarticons:cloud-sun";
  };

  if (loading && !weather) {
    return (
      <div style={{ textAlign: "center", padding: 16 }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading weather...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, height: "100%", overflowY: "auto" }}>
      {/* Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search city..."
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid var(--border-color, #e0e0e0)",
              borderRadius: 4,
              fontSize: 14,
              background: "var(--background)",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              border: "1px solid var(--border-color, #e0e0e0)",
              borderRadius: 4,
              background: "var(--background)",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <p style={{ color: "red", fontSize: 14, marginBottom: 16 }}>{error}</p>
      )}

      {weather && (
        <>
          {/* Current Weather */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>{city}</h3>
            <Icon
              icon={getWeatherIcon(weather.icon)}
              width={64}
              height={64}
              style={{ marginBottom: 12, color: "var(--pastel-peach)" }}
            />
            <h3 style={{ marginBottom: 4, fontSize: 32 }}>{weather.temp}°F</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", textTransform: "capitalize" }}>
              {weather.description}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, fontSize: 12 }}>
              <div>
                <Icon icon="pixelarticons:drop" width={16} height={16} />
                <p>{weather.humidity}%</p>
              </div>
              <div>
                <Icon icon="pixelarticons:wind" width={16} height={16} />
                <p>{weather.windSpeed} mph</p>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          {forecast.length > 0 && (
            <div>
              <h4 style={{ fontSize: 14, marginBottom: 12, color: "var(--text-secondary)" }}>
                7-day forecast
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {forecast.map((day, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "var(--surface, #f5f5f5)",
                      borderRadius: 4,
                      fontSize: 14,
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 100 }}>{day.date}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon icon={getWeatherIcon(day.icon)} width={24} height={24} />
                      <span style={{ minWidth: 40, textAlign: "right", fontWeight: 500 }}>
                        {day.temp}°F
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
