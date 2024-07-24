import axios from "axios";
import { SearchType, Weather } from "../types";

//*typeGuard o assertion
function isWheaterResponse(weather: unknown): weather is Weather {
  return (
    Boolean(weather) &&
    typeof weather === "object" &&
    typeof (weather as Weather).name === "string" &&
    typeof (weather as Weather).main.temp === "number" &&
    typeof (weather as Weather).main.temp_min === "number" &&
    typeof (weather as Weather).main.temp_max === "number"
  )
}

export default function useWeather() {

  const appId = import.meta.env.VITE_API_KEY;

  const fetchWeather = async (search: SearchType) => {
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
      const { data } = await axios(geoUrl)

      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

      //* castear typt
      // const { data: weatherData } = await axios<Weather>(weatherUrl)
      // console.log(weatherData);

      //* type Guards
      const { data: weatherData } = await axios<Weather>(weatherUrl)
      const result = isWheaterResponse(weatherData)
      if (result) {
        console.log(weatherData);
      }



    } catch (error) {
      console.log(error);

    }

  }

  return {
    fetchWeather
  }
}
