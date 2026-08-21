import axios from 'axios'


// =====================================================
// OpenWeatherMap API Key
// =====================================================

const API_KEY =
  import.meta.env.VITE_OPENWEATHER_API_KEY


// =====================================================
// OpenWeatherMap API URL
// =====================================================

// 현재 날씨 API
const CURRENT_WEATHER_URL =
  'https://api.openweathermap.org/data/2.5/weather'

// 5 Day / 3 Hour Forecast API
const FORECAST_URL =
  'https://api.openweathermap.org/data/2.5/forecast'


// =====================================================
// 현재 날씨 조회
//
// 기온 / 습도 / 날씨 상태 / 풍속 등을 조회
// =====================================================

export const fetchWeatherByCity = async (cityName) => {

  const response = await axios.get(
    CURRENT_WEATHER_URL,
    {
      params: {
        q: cityName,
        appid: API_KEY,

        // 섭씨 기준
        units: 'metric',

        // 날씨 설명 한국어
        lang: 'kr',
      },
    }
  )

  return response.data
}


// =====================================================
// 5 Day / 3 Hour Forecast 조회
//
// 강수확률(pop) 등의 예보 데이터를 가져옴
// =====================================================

export const fetchForecastByCity = async (cityName) => {

  const response = await axios.get(
    FORECAST_URL,
    {
      params: {
        q: cityName,
        appid: API_KEY,

        units: 'metric',

        lang: 'kr',
      },
    }
  )

  return response.data
}