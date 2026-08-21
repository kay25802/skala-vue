<script setup>
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
} from '@vue-leaflet/vue-leaflet'

import 'leaflet/dist/leaflet.css'


// =====================================================
// Emits
// 지도에서 선택한 도시 id를 부모에게 전달
// =====================================================

const emit = defineEmits([
  'select-city',
])


// =====================================================
// 지도 기본 설정
// =====================================================

const center = [
  36.3,
  127.8,
]

const zoom = 7


// =====================================================
// 지도에 표시할 도시
// =====================================================

const cities = [
  {
    id: 'city_01',
    name: '서울',
    lat: 37.5665,
    lon: 126.9780,
  },

  {
    id: 'city_02',
    name: '수원',
    lat: 37.2636,
    lon: 127.0286,
  },

  {
    id: 'city_03',
    name: '부산',
    lat: 35.1796,
    lon: 129.0756,
  },

  {
    id: 'city_04',
    name: '광주',
    lat: 35.1595,
    lon: 126.8526,
  },
]


// =====================================================
// 지도 마커 클릭
// =====================================================

const selectCity = (city) => {
  emit(
    'select-city',
    city.id
  )
}
</script>


<template>
  <div class="weather-map">

    <LMap
      :zoom="zoom"
      :center="center"
      class="map"
    >

      <!-- 지도 배경 -->
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />


      <!-- 도시 마커 -->
      <LMarker
        v-for="city in cities"
        :key="city.id"
        :lat-lng="[city.lat, city.lon]"
        @click="selectCity(city)"
      >

        <LPopup>
          <div class="popup-content">

            <strong>
              📍 {{ city.name }}
            </strong>

            <p>
              마커를 클릭하면
              해당 지역의 실제 날씨가 선택됩니다.
            </p>

          </div>
        </LPopup>

      </LMarker>

    </LMap>

  </div>
</template>


<style scoped>
.weather-map {
  width: 100%;
  height: 500px;

  margin-top: 15px;

  border: 1px solid #dee2e6;
  border-radius: 10px;

  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
}

.popup-content {
  min-width: 170px;
  text-align: center;
}

.popup-content strong {
  font-size: 15px;
}

.popup-content p {
  margin: 8px 0 0;

  font-size: 12px;

  color: #6c757d;

  line-height: 1.5;
}
</style>