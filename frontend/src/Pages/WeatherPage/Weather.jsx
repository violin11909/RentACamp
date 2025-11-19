import { useEffect, useState } from "react";

const Weather = ({ day }) => {
    const [temp, setTemp] = useState(null);
    const date = new Date(day.dt * 1000).toLocaleDateString("th-TH", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
    useEffect(() => {
        if (!day) return;
        const getCelsius = (k) => {
            return Math.ceil(k - 273.15);
        }
        setTemp(getCelsius(day.main.temp));
    }, [])

    return (
        <div className="grid grid-cols-4 items-center p-4 bg-white rounded-lg shadow mb-3 hover:shadow-md hover:bg-gray-100">
            <p className="font-semibold col-span-1 text-xl">{date}</p>
            <img
                // ไอคอนสภาพอากาศจาก OpenWeatherMap
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
                className="w-16 h-16 col-span-1"
            />
            <p className={`text-lg font-bold col-span-1 ${temp >= 30 ? 'text-orange-600' : 'text-blue-500'}`} >{temp}°C</p>
            <p className={`text-sm col-span-1`}>{day.weather[0].description}</p>
        </div>
    );
}

export default Weather;