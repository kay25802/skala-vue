<script setup>
import { computed } from 'vue'

import {
  useConfigStore,
} from '@/stores/configStore'


// =====================================================
// Pinia Store
// =====================================================

const configStore =
  useConfigStore()


// =====================================================
// Props
// =====================================================

const props =
  defineProps({

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

const emit =
  defineEmits([
    'select-card',
    'click-detail',
  ])


// =====================================================
// 표시 온도
// =====================================================

const displayTemp =
  computed(() => {

    const rawTemp =
      props.cityItem.temp

    if (
      configStore.unit
      === 'fahrenheit'
    ) {

      return Math.round(
        (rawTemp * 9)
        / 5
        + 32
      )
    }

    return rawTemp
  })


// =====================================================
// 더운 기준 표시
// =====================================================

const displayHotStandard =
  computed(() => {

    if (
      configStore.unit
      === 'fahrenheit'
    ) {

      return Math.round(
        (
          props.hotStandard
          * 9
        )
        / 5
        + 32
      )
    }

    return props.hotStandard
  })


// =====================================================
// 도시명 번역
// =====================================================

const displayCityName =
  computed(() => {

    if (
      configStore.language
      === 'en'
    ) {

      const cityNames = {
        서울: 'Seoul',
        수원: 'Suwon',
        부산: 'Busan',
        광주: 'Gwangju',
      }

      return (
        cityNames[
          props.cityItem.name
        ]
        ||
        props.cityItem.name
      )
    }

    return props.cityItem.name
  })


// =====================================================
// 날씨 상태 표시
// =====================================================

const displayStatus =
  computed(() => {

    if (
      configStore.language
      !== 'en'
    ) {

      return props.cityItem.status
    }


    const statusTranslations = {

      맑음: 'Clear',

      흐림: 'Cloudy',

      구름: 'Cloudy',

      비: 'Rain',

      '약한 비':
        'Light Rain',

      눈: 'Snow',

      박무: 'Mist',
    }


    return (
      statusTranslations[
        props.cityItem.status
      ]
      ||
      props.cityItem.status
    )
  })


// =====================================================
// Open-Meteo US AQI 상태
// =====================================================

const airQualityStatus =
  computed(() => {

    const aqi =
      props.cityItem.aqi

    if (aqi <= 50) {

      return (
        configStore.language
        === 'ko'
          ? '좋음'
          : 'Good'
      )
    }


    if (aqi <= 100) {

      return (
        configStore.language
        === 'ko'
          ? '보통'
          : 'Moderate'
      )
    }


    if (aqi <= 150) {

      return (
        configStore.language
        === 'ko'
          ? '민감군 주의'
          : 'Sensitive Groups'
      )
    }


    if (aqi <= 200) {

      return (
        configStore.language
        === 'ko'
          ? '나쁨'
          : 'Unhealthy'
      )
    }


    return (
      configStore.language
      === 'ko'
        ? '매우 나쁨'
        : 'Very Unhealthy'
    )
  })


// =====================================================
// 카드 선택
// =====================================================

const selectCard = () => {

  const message =
    configStore.language === 'ko'

      ? `${props.cityItem.name}이 선택되었습니다.`

      : `${displayCityName.value} has been selected.`


  emit(
    'select-card',
    message
  )
}
</script>


<template>
  <div
    class="weather-card"
    @click="selectCard"
  >

    <!-- 도시 -->

    <h4>
      {{ displayCityName }}
      ({{ displayStatus }})
    </h4>


    <!-- 기온 -->

    <p>
      🌡️

      {{
        configStore.language
        === 'ko'
          ? '현재 기온:'
          : 'Temperature:'
      }}

      <strong>
        {{ displayTemp }}
        {{ configStore.unitSymbol }}
      </strong>
    </p>


    <!-- 습도 -->

    <p>
      💧

      {{
        configStore.language
        === 'ko'
          ? '습도:'
          : 'Humidity:'
      }}

      <strong>
        {{ cityItem.humidity }}%
      </strong>
    </p>


    <!-- 강수확률 -->

    <p>
      ☔

      {{
        configStore.language
        === 'ko'
          ? '강수확률:'
          : 'Chance of Rain:'
      }}

      <strong>
        {{ cityItem.rain }}%
      </strong>
    </p>


    <!-- 풍속 -->

    <p>
      💨

      {{
        configStore.language
        === 'ko'
          ? '풍속:'
          : 'Wind:'
      }}

      <strong>
        {{ cityItem.wind }}m/s
      </strong>
    </p>


    <!-- ================================================= -->
    <!-- Open-Meteo 대기질 -->
    <!-- ================================================= -->

    <div class="air-quality-box">

      <h5>
        {{
          configStore.language
          === 'ko'
            ? '🍃 대기질 정보'
            : '🍃 Air Quality'
        }}
      </h5>


      <p>
        🌫️

        {{
          configStore.language
          === 'ko'
            ? '미세먼지 PM10:'
            : 'PM10:'
        }}

        <strong>
          {{ cityItem.pm10 }}
          μg/m³
        </strong>
      </p>


      <p>
        😷

        {{
          configStore.language
          === 'ko'
            ? '초미세먼지 PM2.5:'
            : 'PM2.5:'
        }}

        <strong>
          {{ cityItem.pm25 }}
          μg/m³
        </strong>
      </p>


      <p>
        🍃

        {{
          configStore.language
          === 'ko'
            ? '대기질 상태:'
            : 'Air Quality:'
        }}

        <strong>
          {{ airQualityStatus }}
        </strong>
      </p>


      <p>
        AQI:

        <strong>
          {{ cityItem.aqi }}
        </strong>
      </p>

    </div>


    <!-- ================================================= -->
    <!-- 더움 / 선선함 -->
    <!-- ================================================= -->

    <div class="badge-area">

      <span
        v-if="
          cityItem.temp
          >= hotStandard
        "
        class="badge hot"
      >

        <template
          v-if="
            configStore.language
            === 'ko'
          "
        >
          🔥 더움
          (
          {{ displayHotStandard }}
          {{ configStore.unitSymbol }}
          이상
          )
        </template>


        <template v-else>
          🔥 Hot
          (
          {{ displayHotStandard }}
          {{ configStore.unitSymbol }}
          or higher
          )
        </template>

      </span>


      <span
        v-else
        class="badge cool"
      >

        <template
          v-if="
            configStore.language
            === 'ko'
          "
        >
          ❄️ 선선함
          (
          {{ displayHotStandard }}
          {{ configStore.unitSymbol }}
          미만
          )
        </template>


        <template v-else>
          ❄️ Cool
          (
          below
          {{ displayHotStandard }}
          {{ configStore.unitSymbol }}
          )
        </template>

      </span>

    </div>


    <!-- ================================================= -->
    <!-- 습도 상태 -->
    <!-- ================================================= -->

    <div class="humidity-info">

      <span
        v-if="
          cityItem.humidity >= 80
        "
      >

        {{
          configStore.language
          === 'ko'
            ? '💦 습도 높음'
            : '💦 High Humidity'
        }}

      </span>


      <span
        v-else-if="
          cityItem.humidity >= 60
        "
      >

        {{
          configStore.language
          === 'ko'
            ? '💧 습도 보통'
            : '💧 Moderate Humidity'
        }}

      </span>


      <span v-else>

        {{
          configStore.language
          === 'ko'
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
        v-if="
          cityItem.rain
          >= rainStandard
        "
      >

        {{
          configStore.language
          === 'ko'
            ? '☂️ 비가 올 가능성이 높아요. 우산을 챙기세요!'
            : '☂️ There is a high chance of rain. Take an umbrella!'
        }}

      </p>


      <p
        v-else-if="
          cityItem.aqi > 150
        "
      >

        {{
          configStore.language
          === 'ko'
            ? '😷 대기질이 좋지 않습니다. 외출 시 마스크를 권장합니다.'
            : '😷 Air quality is poor. A mask is recommended.'
        }}

      </p>


      <p
        v-else-if="
          cityItem.temp
          >= hotStandard
        "
      >

        {{
          configStore.language
          === 'ko'
            ? '🧴 날씨가 더워요. 자외선 차단제를 챙기세요!'
            : '🧴 It is hot today. Make sure to use sunscreen!'
        }}

      </p>


      <p v-else>

        {{
          configStore.language
          === 'ko'
            ? '😊 비교적 외출하기 좋은 날씨예요!'
            : '😊 The weather is relatively nice for going outside!'
        }}

      </p>

    </div>


    <!-- 상세보기 -->

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
        configStore.language
        === 'ko'
          ? '상세보기'
          : 'Details'
      }}

    </button>

  </div>
</template>


<style scoped>
.weather-card {
  background: #ffffff;

  border:
    1px solid #dee2e6;

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

.air-quality-box {
  margin-top: 12px;

  padding: 10px;

  background-color: #f1f8f5;

  border:
    1px solid #dfeee7;

  border-radius: 6px;
}

.air-quality-box h5 {
  margin:
    0 0 8px 0;

  font-size: 14px;
}

.air-quality-box p {
  margin: 5px 0;
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