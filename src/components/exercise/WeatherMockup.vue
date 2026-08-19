<script setup>
import { ref, computed } from 'vue'

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
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 검색어에 따른 도시 필터링
const filteredWeatherList = computed(() => {
  return weatherList.value.filter((item) =>
    item.name.includes(searchQuery.value.trim())
  )
})

// 상세보기 함수
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">

    <!-- 도시 검색 -->
    <section class="search-box">
      <h3>🔍 도시 검색</h3>

      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />

      <p>
        검색 중인 도시:
        <strong>{{ searchQuery || '없음' }}</strong>
      </p>
    </section>

    <!-- 지역별 날씨 -->
    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
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

        <!-- 본인만의 추가 데이터 -->
        <p>
          💧 습도:
          <strong>{{ item.humidity }}%</strong>
        </p>

        <p>
          ☔ 강수확률:
          <strong>{{ item.rain }}%</strong>
        </p>

        <!-- 기온에 따른 조건부 렌더링 -->
        <div class="badge-area">
          <span
            v-if="item.temp >= 25"
            class="badge hot"
          >
            🔥 더움 (25도 이상)
          </span>

          <span
            v-else
            class="badge cool"
          >
            ❄️ 선선함 (25도 미만)
          </span>
        </div>

        <!-- 습도에 따른 조건부 렌더링 -->
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

        <!-- 날씨에 따른 외출 추천 -->
        <div class="recommend-box">
          <p v-if="item.rain >= 60">
            ☂️ 비가 올 가능성이 높아요. 우산을 챙기세요!
          </p>

          <p v-else-if="item.temp >= 30">
            🧴 날씨가 더워요. 자외선 차단제를 챙기세요!
          </p>

          <p v-else>
            😊 비교적 외출하기 좋은 날씨예요!
          </p>
        </div>

        <!-- 이벤트 실습 -->
        <button
          class="btn-detail"
          @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
          @dblclick="showDetail(item.name, item.status)"
        >
          상세보기
        </button>
      </div>

      <!-- 검색 결과가 없는 경우 -->
      <p
        v-if="filteredWeatherList.length === 0"
        class="no-result"
      >
        검색 결과가 없습니다.
      </p>
    </section>

    <!-- 선택된 도시 상태 표시 -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>

  </div>
</template>