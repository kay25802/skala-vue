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

// ✅ 마음 날씨 컴포넌트 추가
import MindWeather
  from '../components/exercise/MindWeather.vue'


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

// 실제 API 날씨 데이터
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


// 지도에서 선택한 도시 ID
const selectedCityId = ref(null)


// =====================================================
// 날씨 기준값
// =====================================================

// 우산 추천 기준
const rainStandard = ref(60)

// 더운 날씨 기준
const hotStandard = ref(25)


// =====================================================
// OpenWeatherMap + Forecast + Open-Meteo
// =====================================================

const loadWeather = async () => {

  isLoading.value = true

  errorMessage.value = ''

  try {

    const results = await Promise.all(

      cities.map(async (city) => {

        // ===============================================
        // 1. OpenWeatherMap
        // 현재 날씨 + 5 Day / 3 Hour Forecast
        // ===============================================

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


        // ===============================================
        // 2. 가장 가까운 시간의 예보
        // ===============================================

        const nearestForecast =
          forecastData.list?.[0]


        // ===============================================
        // 3. 강수확률 계산
        //
        // pop = 0 ~ 1
        // 0.8 → 80%
        // ===============================================

        const rainProbability =
          Math.round(
            (
              nearestForecast?.pop
              ?? 0
            )
            * 100
          )


        // ===============================================
        // 4. OpenWeatherMap에서 좌표 추출
        // ===============================================

        const latitude =
          currentData.coord.lat

        const longitude =
          currentData.coord.lon


        // ===============================================
        // 5. Open-Meteo Air Quality API
        // ===============================================

        const airQualityData =
          await fetchAirQuality(
            latitude,
            longitude
          )


        // ===============================================
        // 6. WeatherCard에서 사용할 형태로 변환
        // ===============================================

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


          // =============================================
          // Open-Meteo 대기질 데이터
          // =============================================

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

    isLoading.value =
      false
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
        item.name.includes(
          query
        )
    )
  })


// =====================================================
// 지도에서 선택한 도시
// =====================================================

const selectedCity =
  computed(() => {

    if (
      !selectedCityId.value
    ) {

      return null
    }


    return weatherList.value.find(
      (item) =>
        item.id
        === selectedCityId.value
    )
  })


// =====================================================
// ✅ 마음 날씨와 비교할 실제 날씨
//
// 1. 지도에서 선택한 도시가 있으면 그 도시 사용
// 2. 선택된 도시가 없으면 첫 번째 도시(서울) 사용
// =====================================================

const comparisonWeather =
  computed(() => {

    if (
      selectedCity.value
    ) {

      return selectedCity.value
    }


    return (
      weatherList.value[0]
      ?? null
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
// 선택 도시 상태 감시
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
// 검색어 자동 추적
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


      // 검색 결과도 해당 도시로 동기화
      searchQuery.value =
        city.name
    }
  }


// =====================================================
// 지도 선택 해제
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
// 상세 페이지 이동
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
    <!-- 1. 도시 검색 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <SearchBar
        :current-query="searchQuery"
        @update-query="updateSearchQuery"
      />

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- 2. 지도 -->
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


      <!-- ================================================= -->
      <!-- 지도에서 선택한 도시의 실제 날씨 -->
      <!-- ================================================= -->

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
    <!-- 3. ✅ 마음 날씨 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <MindWeather
        :actual-weather="
          comparisonWeather
        "
      />

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- 4. 날씨 기준 설정 -->
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
    <!-- 5. 날씨 요약 -->
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
    <!-- 6. 지역별 실시간 날씨 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <h3>
        🏙️ 지역별 실시간 날씨 및 대기질
      </h3>


      <!-- API Loading -->

      <p
        v-if="isLoading"
        class="loading"
      >
        ⏳ 날씨와 대기질 데이터를
        불러오는 중입니다...
      </p>


      <!-- API Error -->

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


      <!-- 정상 API 데이터 -->

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
    <!-- 7. 선택 상태 -->
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


/* =====================================================
   지도 안내
===================================================== */

.map-guide {
  color: #6c757d;

  font-size: 14px;

  margin-bottom: 10px;
}


/* =====================================================
   지도에서 선택한 도시
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


/* =====================================================
   지도 날씨 정보 Grid
===================================================== */

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


/* =====================================================
   지도 버튼
===================================================== */

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

  border-radius: 5px;

  cursor: pointer;

  font-weight: bold;
}

.detail-button {
  background-color: #3498db;

  color: #ffffff;
}

.detail-button:hover {
  background-color: #2980b9;
}

.clear-button {
  background-color: #e9ecef;

  color: #343a40;
}

.clear-button:hover {
  background-color: #dee2e6;
}


/* =====================================================
   상태바
===================================================== */

.status-bar {
  padding: 12px;

  margin-top: 15px;

  text-align: center;

  background: #343a40;

  color: #ffffff;

  border-radius: 6px;
}


/* =====================================================
   검색 안내
===================================================== */

.search-guide {
  text-align: center;

  color: #6c757d;

  padding: 8px;
}


/* =====================================================
   검색 결과 없음
===================================================== */

.no-result {
  text-align: center;

  color: #e74c3c;

  padding: 10px 0;
}


/* =====================================================
   Loading
===================================================== */

.loading {
  text-align: center;

  padding: 20px;

  color: #3498db;

  font-weight: bold;
}


/* =====================================================
   API Error
===================================================== */

.error-area {
  text-align: center;

  padding: 20px;
}

.error-message {
  color: #e74c3c;

  font-weight: bold;
}

.retry-button {
  margin-top: 10px;

  padding:
    8px 14px;

  border: none;

  border-radius: 4px;

  background-color: #4b6584;

  color: #ffffff;

  cursor: pointer;

  font-weight: bold;
}

.retry-button:hover {
  background-color: #3c536d;
}


/* =====================================================
   Input
===================================================== */

input[type='range'] {
  width: 100%;
}

input[type='number'] {
  padding: 6px;

  border:
    1px solid #ced4da;

  border-radius: 4px;
}
</style>