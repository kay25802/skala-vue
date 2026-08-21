import axios from 'axios'

// =====================================================
// Open-Meteo Air Quality API
// 회원가입 / API Key 없이 사용 가능
// =====================================================

const AIR_QUALITY_URL =
  'https://air-quality-api.open-meteo.com/v1/air-quality'


// =====================================================
// 위도 / 경도를 이용하여 현재 대기질 조회
// =====================================================

export const fetchAirQuality = async (
  latitude,
  longitude
) => {

  const response = await axios.get(
    AIR_QUALITY_URL,
    {
      params: {
        latitude,
        longitude,

        current: [
          'pm10',
          'pm2_5',
          'us_aqi',
        ].join(','),

        timezone: 'Asia/Seoul',
      },
    }
  )

  return response.data
}