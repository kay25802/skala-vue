<script setup>
import {
  ref,
  computed,
  watch,
  watchEffect,
  onMounted,
} from 'vue'

import { useRouter } from 'vue-router'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

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

// 실제 API 데이터를 저장
const weatherList = ref([])


// =====================================================
// API 조회 도시 목록
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
// 기존 상태
// =====================================================

const searchQuery = ref('')

const selectedCityInfo = ref(
  '카드를 클릭하거나 검색해 보세요.'
)

const rainStandard = ref(60)

const hotStandard = ref(25)


// =====================================================
// OpenWeatherMap + Open-Meteo API 호출
// =====================================================

const loadWeather = async () => {

  isLoading.value = true
  errorMessage.value = ''

  try {

    const results = await Promise.all(

      cities.map(async (city) => {

        // -------------------------------------------------
        // 1. OpenWeatherMap
        // 현재 날씨 + Forecast 동시 호출
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
        // 2. 가장 가까운 3시간 예보
        // -------------------------------------------------

        const nearestForecast =
          forecastData.list?.[0]


        // -------------------------------------------------
        // 3. 강수확률
        //
        // pop:
        // 0 ~ 1
        //
        // 0.8 → 80%
        // -------------------------------------------------

        const rainProbability =
          Math.round(
            (nearestForecast?.pop ?? 0)
            * 100
          )


        // -------------------------------------------------
        // 4. OpenWeatherMap에서 도시 좌표 획득
        // -------------------------------------------------

        const latitude =
          currentData.coord.lat

        const longitude =
          currentData.coord.lon


        // -------------------------------------------------
        // 5. 외부 API
        // Open-Meteo Air Quality
        // -------------------------------------------------

        const airQualityData =
          await fetchAirQuality(
            latitude,
            longitude
          )


        // -------------------------------------------------
        // 6. WeatherCard 형식으로 데이터 정리
        // -------------------------------------------------

        return {

          id: city.id,

          name: city.name,

          temp: Math.round(
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


          // ===============================================
          // Open-Meteo 대기질 데이터
          // ===============================================

          pm10:
            airQualityData
              .current
              ?.pm10
            ?? 0,

          pm25:
            airQualityData
              .current
              ?.pm2_5
            ?? 0,

          aqi:
            airQualityData
              .current
              ?.us_aqi
            ?? 0,
        }
      })
    )


    weatherList.value =
      results


    console.log(
      '✅ 날씨 + 예보 + 대기질 데이터 조회 성공:',
      weatherList.value
    )

  } catch (error) {

    console.error(
      '❌ API 데이터를 불러오는 중 오류 발생:',
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
// 검색어 필터링
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
      / weatherList.value.length
    ).toFixed(1)
  })


// =====================================================
// 3. watch
// =====================================================

watch(
  selectedCityInfo,

  (newInfo, oldInfo) => {

    console.log(
      '👀 [watch 감지] 선택 도시 정보가 변경되었습니다.'
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
    `🔍 [watchEffect 자동 호출] 현재 검색어 "${searchQuery.value}"에 매칭되는 날씨 데이터를 확인합니다.`
  )

})


// =====================================================
// 강수확률 기준 watcher
// =====================================================

watch(
  rainStandard,

  (newValue, oldValue) => {

    console.log(
      `☔ [나만의 watcher] 강수확률 기준이 ${oldValue}%에서 ${newValue}%로 변경되었습니다.`
    )

    console.log(
      `현재 ${newValue}% 이상인 도시는 ${rainyCities.value.length}곳입니다.`
    )
  }
)


// =====================================================
// 더운 날씨 기준 watcher
// =====================================================

watch(
  hotStandard,

  (newValue, oldValue) => {

    console.log(
      `🌡️ [나만의 watcher] 더움 기준이 ${oldValue}°C에서 ${newValue}°C로 변경되었습니다.`
    )

    console.log(
      `현재 ${newValue}°C 이상인 도시는 ${hotCities.value.length}곳입니다.`
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

const selectCity =
  (message) => {

    selectedCityInfo.value =
      message
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
    <!-- 검색 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <SearchBar
        :current-query="searchQuery"
        @update-query="updateSearchQuery"
      />

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
        v-model.number="rainStandard"
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
        v-model.number="hotStandard"
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
    <!-- 실시간 날씨 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <h3>
        🏙️ 지역별 실시간 날씨 및 대기질
      </h3>


      <!-- 로딩 -->

      <p
        v-if="isLoading"
        class="loading"
      >
        ⏳ 날씨와 대기질 데이터를
        불러오는 중입니다...
      </p>


      <!-- 에러 -->

      <div
        v-else-if="errorMessage"
        class="error-area"
      >

        <p class="error-message">
          {{ errorMessage }}
        </p>


        <button
          class="retry-button"
          @click="loadWeather"
        >
          다시 불러오기
        </button>

      </div>


      <!-- 정상 데이터 -->

      <template v-else>

        <p
          v-if="
            searchQuery.trim()
            === ''
          "
          class="search-guide"
        >
          🔎 검색어를 입력하면
          원하는 도시를 찾을 수 있습니다.
        </p>


        <WeatherCard
          v-for="
            item in filteredWeatherList
          "
          :key="item.id"

          :city-item="item"

          :hot-standard="
            hotStandard
          "

          :rain-standard="
            rainStandard
          "

          @select-card="
            selectCity
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
    <!-- 선택 도시 -->
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

.status-bar {
  padding: 12px;
  margin-top: 15px;

  text-align: center;

  background: #343a40;
  color: #ffffff;

  border-radius: 6px;
}

.search-guide {
  text-align: center;

  color: #6c757d;

  padding: 8px;
}

.no-result {
  text-align: center;

  color: #e74c3c;

  padding: 10px 0;
}

.loading {
  text-align: center;

  padding: 20px;

  color: #3498db;

  font-weight: bold;
}

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

  padding: 8px 14px;

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