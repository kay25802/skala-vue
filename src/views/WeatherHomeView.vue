<script setup>
import {
  ref,
  computed,
  watch,
  watchEffect,
  onMounted,
} from 'vue'

import { useRouter } from 'vue-router'


// =====================================================
// Components
// =====================================================

import BaseDashboardCard
  from '../components/exercise/BaseDashboardCard.vue'

import SearchBar
  from '../components/exercise/SearchBar.vue'

import WeatherCard
  from '../components/exercise/WeatherCard.vue'

import WeatherMap
  from '../components/exercise/WeatherMap.vue'


// =====================================================
// API
// =====================================================

import {
  fetchWeatherByCity,
  fetchForecastByCity,
} from '@/api/weatherApi'

import {
  fetchAirQuality,
} from '@/api/airQualityApi'


// =====================================================
// Router
// =====================================================

const router = useRouter()


// =====================================================
// 1. 반응형 상태 관리
// =====================================================

const weatherList = ref([])


// =====================================================
// API 조회 도시
// =====================================================

const cities = [
  {
    id: 'city_01',
    apiName: 'Seoul',
    name: '서울',
  },

  {
    id: 'city_02',
    apiName: 'Suwon',
    name: '수원',
  },

  {
    id: 'city_03',
    apiName: 'Busan',
    name: '부산',
  },

  {
    id: 'city_04',
    apiName: 'Gwangju',
    name: '광주',
  },
]


// =====================================================
// API 상태
// =====================================================

const isLoading = ref(false)

const errorMessage = ref('')


// =====================================================
// 검색어
// =====================================================

const searchQuery = ref('')


// =====================================================
// 선택된 도시
// =====================================================

const selectedCityInfo = ref(
  '카드를 클릭하거나 지도에서 지역을 선택해 보세요.'
)


// ✅ 지도에서 선택한 도시 id
const selectedCityId = ref(null)


// =====================================================
// 기준값
// =====================================================

const rainStandard = ref(60)

const hotStandard = ref(25)


// =====================================================
// 실제 날씨 API 조회
// =====================================================

const loadWeather = async () => {

  isLoading.value = true
  errorMessage.value = ''

  try {

    const results = await Promise.all(

      cities.map(async (city) => {

        // -------------------------------------------------
        // OpenWeatherMap
        // 현재 날씨 + Forecast
        // -------------------------------------------------

        const [
          currentData,
          forecastData,
        ] = await Promise.all([
          fetchWeatherByCity(
            city.apiName
          ),

          fetchForecastByCity(
            city.apiName
          ),
        ])


        // -------------------------------------------------
        // 가장 가까운 3시간 예보
        // -------------------------------------------------

        const nearestForecast =
          forecastData.list?.[0]


        // -------------------------------------------------
        // 강수확률
        // -------------------------------------------------

        const rainProbability =
          Math.round(
            (
              nearestForecast?.pop
              ?? 0
            )
            * 100
          )


        // -------------------------------------------------
        // 도시 좌표
        // -------------------------------------------------

        const latitude =
          currentData.coord.lat

        const longitude =
          currentData.coord.lon


        // -------------------------------------------------
        // Open-Meteo 대기질 API
        // -------------------------------------------------

        const airQualityData =
          await fetchAirQuality(
            latitude,
            longitude
          )


        // -------------------------------------------------
        // WeatherCard용 데이터
        // -------------------------------------------------

        return {

          id: city.id,

          name: city.name,

          temp:
            Math.round(
              currentData.main.temp
            ),

          status:
            currentData
              .weather?.[0]
              ?.description
            ?? '정보 없음',

          humidity:
            currentData.main.humidity,

          rain:
            rainProbability,

          wind:
            currentData.wind?.speed
            ?? 0,

          pm10:
            airQualityData
              .current?.pm10
            ?? 0,

          pm25:
            airQualityData
              .current?.pm2_5
            ?? 0,

          aqi:
            airQualityData
              .current?.us_aqi
            ?? 0,
        }
      })
    )


    weatherList.value =
      results


    console.log(
      '✅ 날씨 + 예보 + 대기질 조회 성공:',
      weatherList.value
    )

  } catch (error) {

    console.error(
      '❌ API 데이터 조회 실패:',
      error
    )


    if (
      error.response?.status
      === 401
    ) {

      errorMessage.value =
        'OpenWeatherMap API 인증에 실패했습니다. API Key를 확인해 주세요.'

    } else {

      errorMessage.value =
        '날씨 및 대기질 데이터를 불러오지 못했습니다.'
    }

  } finally {

    isLoading.value = false
  }
}


// =====================================================
// 최초 API 호출
// =====================================================

onMounted(() => {
  loadWeather()
})


// =====================================================
// 2. computed
// 검색 필터
// =====================================================

const filteredWeatherList =
  computed(() => {

    const query =
      searchQuery.value.trim()

    if (!query) {
      return weatherList.value
    }

    return weatherList.value.filter(
      (item) =>
        item.name.includes(query)
    )
  })


// =====================================================
// 지도에서 선택된 도시
// =====================================================

const selectedCity =
  computed(() => {

    if (!selectedCityId.value) {
      return null
    }

    return weatherList.value.find(
      (item) =>
        item.id === selectedCityId.value
    )
  })


// =====================================================
// 강수확률 높은 도시
// =====================================================

const rainyCities =
  computed(() => {

    return weatherList.value.filter(
      (item) =>
        item.rain
        >= rainStandard.value
    )
  })


// =====================================================
// 더운 도시
// =====================================================

const hotCities =
  computed(() => {

    return weatherList.value.filter(
      (item) =>
        item.temp
        >= hotStandard.value
    )
  })


// =====================================================
// 평균 기온
// =====================================================

const averageTemperature =
  computed(() => {

    if (
      weatherList.value.length
      === 0
    ) {

      return 0
    }

    const totalTemp =
      weatherList.value.reduce(
        (sum, item) =>
          sum + item.temp,
        0
      )

    return (
      totalTemp
      /
      weatherList.value.length
    ).toFixed(1)
  })


// =====================================================
// 3. watch
// =====================================================

watch(
  selectedCityInfo,

  (newInfo, oldInfo) => {

    console.log(
      '👀 [watch] 선택 도시 변경'
    )

    console.log(
      `이전 상태: ${oldInfo}`
    )

    console.log(
      `현재 상태: ${newInfo}`
    )
  }
)


// =====================================================
// watchEffect
// =====================================================

watchEffect(() => {

  console.log(
    `🔍 검색어: ${searchQuery.value}`
  )

})


// =====================================================
// 강수확률 기준 감시
// =====================================================

watch(
  rainStandard,

  (newValue, oldValue) => {

    console.log(
      `☔ 강수확률 기준: ${oldValue}% → ${newValue}%`
    )

    console.log(
      `${newValue}% 이상 도시: ${rainyCities.value.length}곳`
    )
  }
)


// =====================================================
// 더운 날씨 기준 감시
// =====================================================

watch(
  hotStandard,

  (newValue, oldValue) => {

    console.log(
      `🌡️ 더움 기준: ${oldValue}°C → ${newValue}°C`
    )

    console.log(
      `${newValue}°C 이상 도시: ${hotCities.value.length}곳`
    )
  }
)


// =====================================================
// SearchBar 이벤트
// =====================================================

const updateSearchQuery =
  (value) => {

    searchQuery.value =
      value
  }


// =====================================================
// WeatherCard 선택 이벤트
// =====================================================

const selectCityFromCard =
  (message) => {

    selectedCityInfo.value =
      message
  }


// =====================================================
// 지도에서 도시 선택
// =====================================================

const selectCityFromMap =
  (cityId) => {

    selectedCityId.value =
      cityId


    const city =
      weatherList.value.find(
        (item) =>
          item.id === cityId
      )


    if (city) {

      selectedCityInfo.value =
        `🗺️ 지도에서 ${city.name}이 선택되었습니다.`

      // 검색창에도 해당 도시를 넣어서
      // 아래 카드 목록에서 해당 도시만 표시
      searchQuery.value =
        city.name
    }
  }


// =====================================================
// 선택 해제
// =====================================================

const clearMapSelection = () => {

  selectedCityId.value =
    null

  searchQuery.value =
    ''

  selectedCityInfo.value =
    '카드를 클릭하거나 지도에서 지역을 선택해 보세요.'
}


// =====================================================
// 상세 페이지
// =====================================================

const showDetail =
  (id) => {

    router.push(
      '/weather/' + id
    )
  }
</script>


<template>
  <div class="dashboard-wrapper">

    <!-- ================================================= -->
    <!-- 검색 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <SearchBar
        :current-query="searchQuery"
        @update-query="updateSearchQuery"
      />

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- 지도 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <h3>
        🗺️ 지역 날씨 지도
      </h3>

      <p class="map-guide">
        지도 마커를 클릭하면 해당 지역의
        실제 날씨를 확인할 수 있습니다.
      </p>


      <WeatherMap
        @select-city="
          selectCityFromMap
        "
      />


      <!-- =============================================== -->
      <!-- 지도에서 선택한 도시의 실제 날씨 -->
      <!-- =============================================== -->

      <div
        v-if="selectedCity"
        class="map-weather-result"
      >

        <h4>
          📍 {{ selectedCity.name }}
          실시간 날씨
        </h4>


        <div class="map-weather-grid">

          <div>
            🌡️ 기온
            <strong>
              {{ selectedCity.temp }}°C
            </strong>
          </div>

          <div>
            💧 습도
            <strong>
              {{ selectedCity.humidity }}%
            </strong>
          </div>

          <div>
            ☔ 강수확률
            <strong>
              {{ selectedCity.rain }}%
            </strong>
          </div>

          <div>
            💨 풍속
            <strong>
              {{ selectedCity.wind }}m/s
            </strong>
          </div>

          <div>
            🌫️ PM10
            <strong>
              {{ selectedCity.pm10 }}
            </strong>
          </div>

          <div>
            😷 PM2.5
            <strong>
              {{ selectedCity.pm25 }}
            </strong>
          </div>

          <div>
            🍃 AQI
            <strong>
              {{ selectedCity.aqi }}
            </strong>
          </div>

        </div>


        <div class="map-result-buttons">

          <button
            class="detail-button"
            @click="
              showDetail(
                selectedCity.id
              )
            "
          >
            상세 날씨 보기
          </button>


          <button
            class="clear-button"
            @click="
              clearMapSelection
            "
          >
            선택 해제
          </button>

        </div>

      </div>

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- 날씨 기준 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <h3>
        ⚙️ 날씨 기준 설정
      </h3>


      <p>
        ☔ 우산 추천 기준:

        <strong>
          {{ rainStandard }}%
        </strong>
      </p>


      <input
        v-model.number="
          rainStandard
        "
        type="range"
        min="0"
        max="100"
        step="10"
      />


      <p>
        🌡️ 더운 날씨 기준:

        <strong>
          {{ hotStandard }}°C
        </strong>
      </p>


      <input
        v-model.number="
          hotStandard
        "
        type="number"
        min="0"
        max="50"
      />

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- 날씨 요약 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <h3>
        📊 날씨 요약
      </h3>


      <p>
        🌡️ 전체 도시 평균 기온:

        <strong>
          {{ averageTemperature }}°C
        </strong>
      </p>


      <p>
        🔥
        {{ hotStandard }}°C
        이상인 도시:

        <strong>
          {{ hotCities.length }}곳
        </strong>
      </p>


      <p>
        ☔ 강수확률
        {{ rainStandard }}%
        이상인 도시:

        <strong>
          {{ rainyCities.length }}곳
        </strong>
      </p>

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- 실제 날씨 카드 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <h3>
        🏙️ 지역별 실시간 날씨 및 대기질
      </h3>


      <p
        v-if="isLoading"
        class="loading"
      >
        ⏳ 날씨와 대기질 데이터를
        불러오는 중입니다...
      </p>


      <div
        v-else-if="
          errorMessage
        "
        class="error-area"
      >

        <p class="error-message">
          {{ errorMessage }}
        </p>


        <button
          class="retry-button"
          @click="
            loadWeather
          "
        >
          다시 불러오기
        </button>

      </div>


      <template v-else>

        <p
          v-if="
            searchQuery.trim()
            === ''
          "
          class="search-guide"
        >
          🔎 검색어를 입력하거나
          지도에서 도시를 선택해 보세요.
        </p>


        <WeatherCard
          v-for="
            item
            in filteredWeatherList
          "
          :key="
            item.id
          "

          :city-item="
            item
          "

          :hot-standard="
            hotStandard
          "

          :rain-standard="
            rainStandard
          "

          @select-card="
            selectCityFromCard
          "

          @click-detail="
            showDetail
          "
        />


        <p
          v-if="
            searchQuery.trim() !== ''
            &&
            filteredWeatherList.length
            === 0
          "
          class="no-result"
        >
          😭 검색 결과와 일치하는
          도시가 없습니다.
        </p>

      </template>

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- 선택 상태 -->
    <!-- ================================================= -->

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>

  </div>
</template>


<style scoped>
.dashboard-wrapper {
  width: 100%;
  margin: 0 auto;
}

.map-guide {
  color: #6c757d;

  font-size: 14px;

  margin-bottom: 10px;
}


/* =====================================================
   지도 선택 결과
===================================================== */

.map-weather-result {
  margin-top: 15px;

  padding: 18px;

  background-color: #f1f8f5;

  border:
    1px solid #dfeee7;

  border-radius: 8px;
}

.map-weather-result h4 {
  margin-top: 0;
}


/* 날씨 정보 grid */

.map-weather-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(130px, 1fr)
    );

  gap: 10px;

  margin-top: 12px;
}

.map-weather-grid div {
  padding: 10px;

  background-color: #ffffff;

  border:
    1px solid #e9ecef;

  border-radius: 6px;
}

.map-weather-grid strong {
  display: block;

  margin-top: 4px;

  font-size: 16px;
}


/* 버튼 영역 */

.map-result-buttons {
  display: flex;

  gap: 10px;

  margin-top: 15px;
}

.detail-button,
.clear-button {
  padding:
    8px 14px;

  border: none;

  border-radius:
    5px;

  cursor:
    pointer;

  font-weight:
    bold;
}

.detail-button {
  background-color:
    #3498db;

  color:
    #ffffff;
}

.detail-button:hover {
  background-color:
    #2980b9;
}

.clear-button {
  background-color:
    #e9ecef;

  color:
    #343a40;
}

.clear-button:hover {
  background-color:
    #dee2e6;
}


/* =====================================================
   기존 스타일
===================================================== */

.status-bar {
  padding: 12px;

  margin-top: 15px;

  text-align: center;

  background:
    #343a40;

  color:
    #ffffff;

  border-radius:
    6px;
}

.search-guide {
  text-align: center;

  color:
    #6c757d;

  padding:
    8px;
}

.no-result {
  text-align: center;

  color:
    #e74c3c;

  padding:
    10px 0;
}

.loading {
  text-align: center;

  padding:
    20px;

  color:
    #3498db;

  font-weight:
    bold;
}

.error-area {
  text-align: center;

  padding:
    20px;
}

.error-message {
  color:
    #e74c3c;

  font-weight:
    bold;
}

.retry-button {
  margin-top:
    10px;

  padding:
    8px 14px;

  border:
    none;

  border-radius:
    4px;

  background-color:
    #4b6584;

  color:
    #ffffff;

  cursor:
    pointer;

  font-weight:
    bold;
}

.retry-button:hover {
  background-color:
    #3c536d;
}

input[type='range'] {
  width:
    100%;
}

input[type='number'] {
  padding:
    6px;

  border:
    1px solid #ced4da;

  border-radius:
    4px;
}
</style>