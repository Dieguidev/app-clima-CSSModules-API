import axios from "axios";
import { SearchType } from "../types";
import { z } from "zod";
import { useMemo, useState } from "react";
// import * as v  from 'valibot'


//*typeGuard o assertion
// function isWheaterResponse(weather: unknown): weather is Weather {
//   return (
//     Boolean(weather) &&
//     typeof weather === "object" &&
//     typeof (weather as Weather).name === "string" &&
//     typeof (weather as Weather).main.temp === "number" &&
//     typeof (weather as Weather).main.temp_min === "number" &&
//     typeof (weather as Weather).main.temp_max === "number"
//   )
// }

//*ZOD
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_min: z.number(),
    temp_max: z.number()
  })
})
export type Weather = z.infer<typeof Weather>

//*valibot
// const WeatherSchema = v.object({
//   name: v.string(),
//   main: v.object({
//     temp: v.number(),
//     temp_min: v.number(),
//     temp_max: v.number()
//   })
// })
// type Weather = v.InferOutput<typeof WeatherSchema>



export default function useWeather() {

  const [weather, setWeather] = useState({
    name: "",
    main: {
      temp: 0,
      temp_min: 0,
      temp_max: 0
    }
  })

  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;
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
      // const { data: weatherData } = await axios<Weather>(weatherUrl)
      // const result = isWheaterResponse(weatherData)
      // if (result) {
      //   console.log(weatherData.name);
      // } else {
      //   console.log("No es una respuesta válida");
      // }

      //*zod
      const { data: weatherData } = await axios(weatherUrl)
      const result = Weather.safeParse(weatherData)
      if (result.success) {
        setWeather(result.data)
      } else {
        console.log("No es una respuesta válida");
      }

      //*valibot
      // const { data: weatherData } = await axios(weatherUrl)
      // const result = v.parse(WeatherSchema, weatherData)
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  const hasWeatherData = useMemo(() => weather.name, [weather])

  return {
    weather,
    fetchWeather,
    hasWeatherData
  }
}
