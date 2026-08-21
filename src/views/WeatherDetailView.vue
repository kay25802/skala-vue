<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'


// =====================================================
// Vue Router
// =====================================================

const route = useRoute()
const router = useRouter()


// =====================================================
// 상세 페이지용 Mock Data
// =====================================================

const mockDetails = {
  city_01: {
    name: '대한민국 서울특별시',
    temp: 28,
    status: '맑음',
    humidity: '65%',
    rain: '10%',
    wind: '2.5m/s',
  },

  city_02: {
    name: '경기도 수원시 영통구',
    temp: 24,
    status: '비',
    humidity: '82%',
    rain: '80%',
    wind: '4.1m/s',
  },

  city_03: {
    name: '부산광역시 해운대구',
    temp: 26,
    status: '구름',
    humidity: '75%',
    rain: '40%',
    wind: '5.0m/s',
  },

  city_04: {
    name: '광주광역시 광산구',
    temp: 30,
    status: '맑음',
    humidity: '68%',
    rain: '20%',
    wind: '3.6m/s',
  },
}


// =====================================================
// URL의 cityId를 이용하여 상세 데이터 조회
//
// 예:
// /weather/city_01
// → route.params.cityId === 'city_01'
// =====================================================

const cityData = computed(() => {
  const id = route.params.cityId

  return mockDetails[id] || null
})


// =====================================================
// 메인 날씨 대시보드로 이동
// =====================================================

const goHome = () => {
  router.push('/weather')
}
</script>


<template>
  <div class="detail-container">

    <h3>
      📊 지역별 상세 기상 관측 정보
    </h3>

    <hr />


    <!-- ================================================= -->
    <!-- 도시 데이터가 존재하는 경우 -->
    <!-- ================================================= -->

    <div
      v-if="cityData"
      class="info-card"
    >

      <h4>
        📍 지정 지역:
        {{ cityData.name }}
      </h4>

      <p>
        🌡️ 실시간 기온:
        <strong>
          {{ cityData.temp }}°C
        </strong>
      </p>

      <p>
        ☀️ 기상 현황:
        <strong>
          {{ cityData.status }}
        </strong>
      </p>

      <p>
        💧 대기 습도:
        <strong>
          {{ cityData.humidity }}
        </strong>
      </p>

      <p>
        ☔ 강수확률:
        <strong>
          {{ cityData.rain }}
        </strong>
      </p>

      <p>
        💨 현재 풍속:
        <strong>
          {{ cityData.wind }}
        </strong>
      </p>

    </div>


    <!-- ================================================= -->
    <!-- 존재하지 않는 cityId -->
    <!-- ================================================= -->

    <div v-else>

      <p class="no-data">
        😢 해당 지역의 상세 데이터가 존재하지 않습니다.
      </p>

    </div>


    <!-- ================================================= -->
    <!-- 메인으로 돌아가기 -->
    <!-- ================================================= -->

    <button
      class="back-btn"
      @click="goHome"
    >
      ← 메인 대시보드로 돌아가기
    </button>

  </div>
</template>


<style scoped>
.detail-container {
  width: 600px;
  margin: 30px auto;
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.info-card {
  background: #f1f2f6;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}

.info-card h4 {
  margin-top: 0;
}

.info-card p {
  margin: 10px 0;
}

.no-data {
  text-align: center;
  color: #e74c3c;
  padding: 20px;
}

.back-btn {
  padding: 8px 12px;
  background: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:hover {
  background: #34495e;
}
</style>