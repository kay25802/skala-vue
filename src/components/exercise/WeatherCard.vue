<script setup>
// =====================================================
// Props
// 부모 WeatherParent로부터 도시 데이터와 기준값을 전달받음
// =====================================================

defineProps({
  // 도시 하나의 날씨 정보
  cityItem: {
    type: Object,
    required: true,
  },

  // 더운 날씨 판단 기준
  hotStandard: {
    type: Number,
    required: true,
  },

  // 우산 추천 강수확률 기준
  rainStandard: {
    type: Number,
    required: true,
  },
})

// =====================================================
// Emits
// 자식에서 발생한 사용자 행동을 부모에게 전달
// =====================================================

const emit = defineEmits([
  'select-card',
  'click-detail',
])
</script>

<template>
  <div
    class="weather-card"
    @click="
      emit(
        'select-card',
        `${cityItem.name}이 선택되었습니다.`
      )
    "
  >

    <!-- 도시 이름 -->
    <h4>
      {{ cityItem.name }} ({{ cityItem.status }})
    </h4>


    <!-- 기온 -->
    <p>
      🌡️ 현재 기온:
      <strong>{{ cityItem.temp }}°C</strong>
    </p>


    <!-- 습도 -->
    <p>
      💧 습도:
      <strong>{{ cityItem.humidity }}%</strong>
    </p>


    <!-- 강수확률 -->
    <p>
      ☔ 강수확률:
      <strong>{{ cityItem.rain }}%</strong>
    </p>


    <!-- ================================================= -->
    <!-- 더움 / 선선함 -->
    <!-- ================================================= -->

    <div class="badge-area">

      <span
        v-if="cityItem.temp >= hotStandard"
        class="badge hot"
      >
        🔥 더움 ({{ hotStandard }}도 이상)
      </span>

      <span
        v-else
        class="badge cool"
      >
        ❄️ 선선함 ({{ hotStandard }}도 미만)
      </span>

    </div>


    <!-- ================================================= -->
    <!-- 습도 상태 -->
    <!-- ================================================= -->

    <div class="humidity-info">

      <span v-if="cityItem.humidity >= 80">
        💦 습도 높음
      </span>

      <span v-else-if="cityItem.humidity >= 60">
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

      <p v-if="cityItem.rain >= rainStandard">
        ☂️ 비가 올 가능성이 높아요.
        우산을 챙기세요!
      </p>

      <p v-else-if="cityItem.temp >= hotStandard">
        🧴 날씨가 더워요.
        자외선 차단제를 챙기세요!
      </p>

      <p v-else>
        😊 비교적 외출하기 좋은 날씨예요!
      </p>

    </div>


    <!-- ================================================= -->
    <!-- 상세보기 -->
    <!-- ================================================= -->

    <button
      class="btn-detail"
      @click.stop="
        emit(
          'click-detail',
          cityItem.name,
          cityItem.status
        )
      "
    >
      상세보기
    </button>

  </div>
</template>


<style scoped>
.weather-card {
  background: #ffffff;
  border: 1px solid #dee2e6;
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
}

.weather-card:hover {
  background: #f8f9fa;
}

.weather-card h4 {
  margin-top: 0;
}

.badge-area {
  margin-top: 10px;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #ffffff;
}

.hot {
  background-color: #ff7675;
}

.cool {
  background-color: #74b9ff;
}

.humidity-info {
  margin-top: 10px;
}

.recommend-box {
  margin-top: 10px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.recommend-box p {
  margin: 0;
}

.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>