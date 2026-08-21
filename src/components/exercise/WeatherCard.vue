 <script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'


// =====================================================
// Pinia Store
// 날씨 단위 및 언어 설정값을 전역 Store에서 가져옴
// =====================================================

const configStore = useConfigStore()


// =====================================================
// Props
// 부모 컴포넌트로부터 도시 데이터와 기준값을 전달받음
// =====================================================

const props = defineProps({

  cityItem: {
    type: Object,
    required: true,
  },

  hotStandard: {
    type: Number,
    required: true,
  },

  rainStandard: {
    type: Number,
    required: true,
  },
})


// =====================================================
// Emits
// =====================================================

const emit = defineEmits([
  'select-card',
  'click-detail',
])


// =====================================================
// computed
// 현재 Store의 단위 설정에 따라 표시할 온도를 계산
// =====================================================

const displayTemp = computed(() => {

  const rawTemp = props.cityItem.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round(
      (rawTemp * 9) / 5 + 32
    )
  }

  return rawTemp
})


// =====================================================
// computed
// 더운 날씨 기준값 표시
// =====================================================

const displayHotStandard = computed(() => {

  if (configStore.unit === 'fahrenheit') {
    return Math.round(
      (props.hotStandard * 9) / 5 + 32
    )
  }

  return props.hotStandard
})


// =====================================================
// ✅ 언어 변환
// 도시 이름
// =====================================================

const displayCityName = computed(() => {

  if (configStore.language === 'en') {

    const cityNames = {
      서울: 'Seoul',
      수원: 'Suwon',
      부산: 'Busan',
      광주: 'Gwangju',
    }

    return cityNames[props.cityItem.name]
      || props.cityItem.name
  }

  return props.cityItem.name
})


// =====================================================
// ✅ 언어 변환
// 날씨 상태
// =====================================================

const displayStatus = computed(() => {

  if (configStore.language === 'en') {

    const statusNames = {
      맑음: 'Sunny',
      비: 'Rainy',
      구름: 'Cloudy',
    }

    return statusNames[props.cityItem.status]
      || props.cityItem.status
  }

  return props.cityItem.status
})


// =====================================================
// ✅ 카드 선택 메시지
// =====================================================

const selectCard = () => {

  const message =
    configStore.language === 'ko'
      ? `${props.cityItem.name}이 선택되었습니다.`
      : `${displayCityName.value} has been selected.`

  emit('select-card', message)
}
</script>


<template>
  <div
    class="weather-card"
    @click="selectCard"
  >

    <!-- ================================================= -->
    <!-- 도시 이름 / 날씨 상태 -->
    <!-- ================================================= -->

    <h4>
      {{ displayCityName }}
      ({{ displayStatus }})
    </h4>


    <!-- ================================================= -->
    <!-- 현재 기온 -->
    <!-- ================================================= -->

    <p>
      🌡️
      {{
        configStore.language === 'ko'
          ? '현재 기온:'
          : 'Temperature:'
      }}

      <strong>
        {{ displayTemp }}{{ configStore.unitSymbol }}
      </strong>
    </p>


    <!-- ================================================= -->
    <!-- 습도 -->
    <!-- ================================================= -->

    <p>
      💧
      {{
        configStore.language === 'ko'
          ? '습도:'
          : 'Humidity:'
      }}

      <strong>
        {{ cityItem.humidity }}%
      </strong>
    </p>


    <!-- ================================================= -->
    <!-- 강수확률 -->
    <!-- ================================================= -->

    <p>
      ☔
      {{
        configStore.language === 'ko'
          ? '강수확률:'
          : 'Chance of Rain:'
      }}

      <strong>
        {{ cityItem.rain }}%
      </strong>
    </p>


    <!-- ================================================= -->
    <!-- 더움 / 선선함 -->
    <!-- ================================================= -->

    <div class="badge-area">

      <span
        v-if="cityItem.temp >= hotStandard"
        class="badge hot"
      >
        <template v-if="configStore.language === 'ko'">
          🔥 더움
          (
          {{ displayHotStandard }}{{ configStore.unitSymbol }}
          이상
          )
        </template>

        <template v-else>
          🔥 Hot
          (
          {{ displayHotStandard }}{{ configStore.unitSymbol }}
          or higher
          )
        </template>
      </span>


      <span
        v-else
        class="badge cool"
      >
        <template v-if="configStore.language === 'ko'">
          ❄️ 선선함
          (
          {{ displayHotStandard }}{{ configStore.unitSymbol }}
          미만
          )
        </template>

        <template v-else>
          ❄️ Cool
          (
          below
          {{ displayHotStandard }}{{ configStore.unitSymbol }}
          )
        </template>
      </span>

    </div>


    <!-- ================================================= -->
    <!-- 습도 상태 -->
    <!-- ================================================= -->

    <div class="humidity-info">

      <span
        v-if="cityItem.humidity >= 80"
      >
        {{
          configStore.language === 'ko'
            ? '💦 습도 높음'
            : '💦 High Humidity'
        }}
      </span>

      <span
        v-else-if="cityItem.humidity >= 60"
      >
        {{
          configStore.language === 'ko'
            ? '💧 습도 보통'
            : '💧 Moderate Humidity'
        }}
      </span>

      <span
        v-else
      >
        {{
          configStore.language === 'ko'
            ? '🌵 건조함'
            : '🌵 Dry'
        }}
      </span>

    </div>


    <!-- ================================================= -->
    <!-- 외출 추천 -->
    <!-- ================================================= -->

    <div class="recommend-box">

      <p
        v-if="cityItem.rain >= rainStandard"
      >
        {{
          configStore.language === 'ko'
            ? '☂️ 비가 올 가능성이 높아요. 우산을 챙기세요!'
            : '☂️ There is a high chance of rain. Take an umbrella!'
        }}
      </p>


      <p
        v-else-if="cityItem.temp >= hotStandard"
      >
        {{
          configStore.language === 'ko'
            ? '🧴 날씨가 더워요. 자외선 차단제를 챙기세요!'
            : '🧴 It is hot today. Make sure to use sunscreen!'
        }}
      </p>


      <p
        v-else
      >
        {{
          configStore.language === 'ko'
            ? '😊 비교적 외출하기 좋은 날씨예요!'
            : '😊 The weather is relatively nice for going outside!'
        }}
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
          cityItem.id
        )
      "
    >
      {{
        configStore.language === 'ko'
          ? '상세보기'
          : 'Details'
      }}
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