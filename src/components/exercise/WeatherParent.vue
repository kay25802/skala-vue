<script setup>
import {
  ref,
  computed,
  watch,
  watchEffect,
} from 'vue'

// =====================================================
// 자식 컴포넌트 import
// =====================================================

import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'


// =====================================================
// 1. 반응형 상태 관리
// =====================================================

// 날씨 데이터
// Mockup에서 추가했던 humidity, rain 데이터 유지
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 65,
    rain: 10,
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 82,
    rain: 80,
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 75,
    rain: 40,
  },
  {
    id: 'city_04',
    name: '광주',
    temp: 30,
    status: '맑음',
    humidity: 68,
    rain: 20,
  },
])


// 검색어
const searchQuery = ref('')


// 선택된 도시
const selectedCityInfo = ref(
  '카드를 클릭하거나 검색해 보세요.'
)


// =====================================================
// ✅ 본인만의 반응형 상태변수
// =====================================================

// 우산 추천 기준
const rainStandard = ref(60)

// 더운 날씨 기준
const hotStandard = ref(25)


// =====================================================
// 2. computed
// 검색어를 이용한 도시 필터링
// =====================================================

const filteredWeatherList = computed(() => {

  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) =>
    item.name.includes(query)
  )
})


// =====================================================
// ✅ 본인만의 computed 1
// 강수확률이 높은 도시
// =====================================================

const rainyCities = computed(() => {

  return weatherList.value.filter(
    (item) =>
      item.rain >= rainStandard.value
  )
})


// =====================================================
// ✅ 본인만의 computed 2
// 더운 도시
// =====================================================

const hotCities = computed(() => {

  return weatherList.value.filter(
    (item) =>
      item.temp >= hotStandard.value
  )
})


// =====================================================
// ✅ 본인만의 computed 3
// 전체 평균 기온
// =====================================================

const averageTemperature = computed(() => {

  if (weatherList.value.length === 0) {
    return 0
  }

  const totalTemp =
    weatherList.value.reduce(
      (sum, item) => sum + item.temp,
      0
    )

  return (
    totalTemp /
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
      `👀 [watch 감지] 선택 도시 정보가 변경되었습니다.`
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
// searchQuery 자동 의존성 추적
// =====================================================

watchEffect(() => {

  console.log(
    `🔍 [watchEffect 자동 호출] 현재 검색어 "${searchQuery.value}"에 매칭되는 날씨 데이터를 확인합니다.`
  )

})


// =====================================================
// ✅ 본인만의 watcher
// 강수확률 기준 감시
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
// ✅ 본인만의 watcher
// 더운 날씨 기준 감시
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
// SearchBar에서 emit한 검색어 처리
// =====================================================

const updateSearchQuery = (value) => {
  searchQuery.value = value
}


// =====================================================
// WeatherCard에서 emit한 카드 선택 처리
// =====================================================

const selectCity = (message) => {
  selectedCityInfo.value = message
}


// =====================================================
// WeatherCard 상세보기 이벤트 처리
// =====================================================

const showDetail = (cityName, status) => {

  window.alert(
    `${cityName}의 현재 날씨는 [${status}] 상태입니다.`
  )

}
</script>


<template>
  <div class="dashboard-wrapper">


    <!-- ================================================= -->
    <!-- 검색 영역 -->
    <!-- BaseDashboardCard의 slot 사용 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <SearchBar
        :current-query="searchQuery"
        @update-query="updateSearchQuery"
      />

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- 본인만의 반응형 기준 설정 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <h3>⚙️ 날씨 기준 설정</h3>


      <!-- 우산 추천 기준 -->

      <p>
        ☔ 우산 추천 기준:
        <strong>{{ rainStandard }}%</strong>
      </p>

      <input
        v-model.number="rainStandard"
        type="range"
        min="0"
        max="100"
        step="10"
      />


      <!-- 더운 날씨 기준 -->

      <p>
        🌡️ 더운 날씨 기준:
        <strong>{{ hotStandard }}°C</strong>
      </p>

      <input
        v-model.number="hotStandard"
        type="number"
        min="0"
        max="50"
      />

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- computed 결과 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <h3>📊 날씨 요약</h3>

      <p>
        🌡️ 전체 도시 평균 기온:
        <strong>
          {{ averageTemperature }}°C
        </strong>
      </p>

      <p>
        🔥 {{ hotStandard }}°C 이상인 도시:
        <strong>
          {{ hotCities.length }}곳
        </strong>
      </p>

      <p>
        ☔ 강수확률 {{ rainStandard }}% 이상인 도시:
        <strong>
          {{ rainyCities.length }}곳
        </strong>
      </p>

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- 지역별 날씨 -->
    <!-- ================================================= -->

    <BaseDashboardCard>

      <h3>🏙️ 지역별 날씨 현황</h3>


      <!-- 검색어 없음 -->

      <p
        v-if="searchQuery.trim() === ''"
        class="search-guide"
      >
        🔎 검색어를 입력하면 원하는 도시를 찾을 수 있습니다.
      </p>


      <!-- ================================================= -->
      <!-- WeatherCard -->
      <!--
        Parent → Child
        cityItem / hotStandard / rainStandard

        Child → Parent
        select-card / click-detail
      -->
      <!-- ================================================= -->

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"

        :city-item="item"
        :hot-standard="hotStandard"
        :rain-standard="rainStandard"

        @select-card="selectCity"
        @click-detail="showDetail"
      />


      <!-- 검색 결과 없음 -->

      <p
        v-if="
          searchQuery.trim() !== '' &&
          filteredWeatherList.length === 0
        "
        class="no-result"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>

    </BaseDashboardCard>


    <!-- ================================================= -->
    <!-- 선택된 도시 상태 -->
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

input[type='range'] {
  width: 100%;
}

input[type='number'] {
  padding: 6px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}
</style>