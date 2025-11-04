const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const fetchWeather = async (camp) => {
  try {
    const lat = camp.lat.toFixed(2);
    const lon = camp.lng.toFixed(2);
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.list) {
      const now = new Date();

      const dailyForecasts = data.list
        .filter(item => {
          const itemDate = new Date(item.dt * 1000);
          const diffDays = Math.floor((itemDate - now) / (1000 * 60 * 60 * 24));
          return diffDays >= 0 && diffDays < 5; 
        })
        .filter((item, index) => index % 8 === 0) 
        .slice(0, 5); 

        console.log(dailyForecasts)
      return dailyForecasts;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return [];
  }
};
