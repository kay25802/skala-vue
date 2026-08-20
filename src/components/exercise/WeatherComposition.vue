<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// =====================================================
// 1. 반응형 상태 관리
// =====================================================

// 날씨 데이터
// 본인만의 데이터로 humidity(습도), rain(강수확률)을 추가
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

// 선택된 도시 정보
const selectedCityInfo = ref(
  '카드를 클릭하거나 검색해 보세요.'
)

// =====================================================
// ✅ 본인만의 반응형 상태변수
// =====================================================

// 강수확률이 몇 % 이상이면 우산을 추천할지 기준
const rainStandard = ref(60)

// 더운 날씨 기준 온도
const hotStandard = ref(25)


// =====================================================
// 2. computed - 검색 도시 필터링
// =====================================================

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  // 검색어가 없다면 전체 도시 출력
  if (!query) {
    return weatherList.value
  }

  // 검색어와 도시 이름이 포함 관계인 데이터만 반환
  return weatherList.value.filter((item) =>
    item.name.includes(query)
  )
})


// =====================================================
// ✅ 본인만의 computed 1
// 강수확률이 높은 도시 계산
// =====================================================

const rainyCities = computed(() => {
  return weatherList.value.filter(
    (item) => item.rain >= rainStandard.value
  )
})


// =====================================================
// ✅ 본인만의 computed 2
// 더운 도시 계산
// =====================================================

const hotCities = computed(() => {
  return weatherList.value.filter(
    (item) => item.temp >= hotStandard.value
  )
})


// =====================================================
// ✅ 본인만의 computed 3
// 전체 도시 평균 기온
// =====================================================

const averageTemperature = computed(() => {
  if (weatherList.value.length === 0) {
    return 0
  }

  const totalTemp = weatherList.value.reduce(
    (sum, item) => sum + item.temp,
    0
  )

  return (
    totalTemp / weatherList.value.length
  ).toFixed(1)
})


// =====================================================
// 3. watch - selectedCityInfo 변화 감시
// =====================================================

watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(
    `👀 [watch 감지] 선택 도시 정보가 변경되었습니다.`
  )

  console.log(
    `이전 상태: ${oldInfo}`
  )

  console.log(
    `현재 상태: ${newInfo}`
  )
})


// =====================================================
// 3. watchEffect - searchQuery 자동 추적
// =====================================================

watchEffect(() => {
  console.log(
    `🔍 [watchEffect 자동 호출] 현재 검색어 "${searchQuery.value}"에 매칭되는 날씨 데이터를 확인합니다.`
  )
})


// =====================================================
// ✅ 본인만의 watcher 1
// 강수확률 기준 변경 감시
// =====================================================

watch(rainStandard, (newValue, oldValue) => {
  console.log(
    `☔ [나만의 watcher] 강수확률 기준이 ${oldValue}%에서 ${newValue}%로 변경되었습니다.`
  )

  console.log(
    `현재 ${newValue}% 이상인 도시는 ${rainyCities.value.length}곳입니다.`
  )
})


// =====================================================
// ✅ 본인만의 watcher 2
// 더운 날씨 기준 온도 변경 감시
// =====================================================

watch(hotStandard, (newValue, oldValue) => {
  console.log(
    `🌡️ [나만의 watcher] 더움 기준이 ${oldValue}°C에서 ${newValue}°C로 변경되었습니다.`
  )

  console.log(
    `현재 ${newValue}°C 이상인 도시는 ${hotCities.value.length}곳입니다.`
  )
})


// =====================================================
// 상세보기 함수
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
    <!-- 도시 검색 -->
    <!-- ================================================= -->

    <section class="search-box">

      <h3>🔍 도시 검색</h3>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="검색할 도시 이름 입력"
      />

      <p>
        검색 중인 도시:
        <strong>{{ searchQuery || '없음' }}</strong>
      </p>

    </section>


    <!-- ================================================= -->
    <!-- ✅ 본인만의 반응형 상태 설정 -->
    <!-- ================================================= -->

    <section class="search-box">

      <h3>⚙️ 날씨 기준 설정</h3>

      <!-- 강수확률 기준 -->

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

    </section>


    <!-- ================================================= -->
    <!-- ✅ computed 결과 -->
    <!-- ================================================= -->

    <section class="list-box">

      <h3>📊 날씨 요약</h3>

      <p>
        🌡️ 전체 도시 평균 기온:
        <strong>{{ averageTemperature }}°C</strong>
      </p>

      <p>
        🔥 {{ hotStandard }}°C 이상인 도시:
        <strong>{{ hotCities.length }}곳</strong>
      </p>

      <p>
        ☔ 강수확률 {{ rainStandard }}% 이상인 도시:
        <strong>{{ rainyCities.length }}곳</strong>
      </p>

    </section>


    <!-- ================================================= -->
    <!-- 4. 검색 결과 표시 -->
    <!-- ================================================= -->

    <section class="list-box">

      <h3>🏙️ 지역별 날씨 현황</h3>


      <!-- 검색어가 없는 경우 -->
      <p
        v-if="searchQuery.trim() === ''"
        class="search-guide"
      >
        🔎 검색어를 입력하면 원하는 도시를 찾을 수 있습니다.
      </p>


      <!-- 검색 결과가 있는 경우 -->

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="
          selectedCityInfo =
            `${item.name}이 선택되었습니다.`
        "
      >

        <!-- 도시 이름 -->

        <h4>
          {{ item.name }} ({{ item.status }})
        </h4>


        <!-- 기본 날씨 정보 -->

        <p>
          🌡️ 현재 기온:
          <strong>{{ item.temp }}°C</strong>
        </p>


        <!-- 추가 데이터 -->

        <p>
          💧 습도:
          <strong>{{ item.humidity }}%</strong>
        </p>

        <p>
          ☔ 강수확률:
          <strong>{{ item.rain }}%</strong>
        </p>


        <!-- ================================================= -->
        <!-- 기온 조건부 렌더링 -->
        <!-- ================================================= -->

        <div class="badge-area">

          <span
            v-if="item.temp >= hotStandard"
            class="badge hot"
          >
            🔥 더움
            ({{ hotStandard }}도 이상)
          </span>

          <span
            v-else
            class="badge cool"
          >
            ❄️ 선선함
            ({{ hotStandard }}도 미만)
          </span>

        </div>


        <!-- ================================================= -->
        <!-- 습도 조건부 렌더링 -->
        <!-- ================================================= -->

        <div class="humidity-info">

          <span v-if="item.humidity >= 80">
            💦 습도 높음
          </span>

          <span v-else-if="item.humidity >= 60">
            💧 습도 보통
          </span>

          <span v-else>
            🌵 건조함
          </span>

        </div>


        <!-- ================================================= -->
        <!-- 외출 추천 -->
        <!-- ================================================= -->

        <div class="recommend-box">

          <p v-if="item.rain >= rainStandard">
            ☂️ 비가 올 가능성이 높아요.
            우산을 챙기세요!
          </p>

          <p v-else-if="item.temp >= hotStandard">
            🧴 날씨가 더워요.
            자외선 차단제를 챙기세요!
          </p>

          <p v-else>
            😊 비교적 외출하기 좋은 날씨예요!
          </p>

        </div>


        <!-- 상세보기 -->

        <button
          class="btn-detail"
          @click.stop="
            showDetail(item.name, item.status)
          "
        >
          상세보기
        </button>

      </div>


      <!-- 검색 결과가 없는 경우 -->

      <p
        v-if="
          searchQuery.trim() !== '' &&
          filteredWeatherList.length === 0
        "
        class="no-result"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>

    </section>


    <!-- ================================================= -->
    <!-- 선택 도시 상태 -->
    <!-- ================================================= -->

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>

  </div>
</template>