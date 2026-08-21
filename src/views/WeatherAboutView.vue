<script setup>
import { useRouter } from 'vue-router'


// =====================================================
// Vue Router
// =====================================================

const router = useRouter()


// =====================================================
// 메인 대시보드로 이동
// =====================================================

const handleGoHome = () => {
  router.push('/weather')
}
</script>


<template>
  <div class="about-container">

    <!-- ================================================= -->
    <!-- 서비스 소개 -->
    <!-- ================================================= -->

    <h3>ℹ️ 서비스 소개</h3>

    <hr />


    <div class="description-box">

      <p class="intro-text">
        본 앱은
        <strong>실시간 날씨 · 예보 · 대기질 정보</strong>를
        한 화면에서 확인하고,
        지도와 사용자 맞춤 설정을 통해 날씨를
        직관적으로 탐색할 수 있도록 구현한
        <strong>Vue 3 기반 날씨 대시보드</strong>입니다.
      </p>


      <!-- ================================================= -->
      <!-- 주요 기능 -->
      <!-- ================================================= -->

      <h4>🌤️ 주요 기능</h4>

      <ul>

        <li>
          <strong>실시간 날씨 조회</strong>
          <br />
          OpenWeatherMap API를 활용하여
          서울, 수원, 부산, 광주의
          기온 · 습도 · 풍속 · 기상 상태를 제공합니다.
        </li>

        <li>
          <strong>강수확률 및 날씨 추천</strong>
          <br />
          Forecast API의 강수확률 데이터를 활용하여
          사용자가 설정한 기준에 따라
          우산 필요 여부와 외출 정보를 제공합니다.
        </li>

        <li>
          <strong>대기질 정보 제공</strong>
          <br />
          Open-Meteo Air Quality API를 추가 연동하여
          PM10 · PM2.5 · AQI 정보를 함께 제공합니다.
        </li>

        <li>
          <strong>지도 기반 지역 날씨 탐색</strong>
          <br />
          Leaflet 지도의 지역 마커를 선택하면
          해당 도시의 실제 날씨 데이터와 연동하여
          결과를 바로 확인할 수 있습니다.
        </li>

        <li>
          <strong>사용자 맞춤 날씨 기준 설정</strong>
          <br />
          강수확률과 더운 날씨 기준을 직접 변경하면
          computed와 watch를 통해
          날씨 요약과 추천 결과가 실시간으로 변경됩니다.
        </li>

        <li>
          <strong>마음 날씨 추천</strong>
          <br />
          사용자가 입력한 기분의 감정 키워드를 분석하여
          맑음 · 흐림 · 비 · 천둥 등의
          마음 날씨와 추천 메시지를 제공합니다.
        </li>

      </ul>


      <!-- ================================================= -->
      <!-- 직접 구현한 핵심 기능 -->
      <!-- ================================================= -->

      <h4>✨ 직접 구현한 핵심 기능</h4>

      <div class="custom-feature-box">

        <p>
          단순한 날씨 조회에서 끝나지 않고,
          여러 기능을 직접 추가하여
          날씨 데이터를 다양하게 활용할 수 있도록 확장했습니다.
        </p>

        <ul>

          <li>
            OpenWeatherMap의
            <strong>현재 날씨 API + Forecast API</strong>
            데이터 통합
          </li>

          <li>
            OpenWeatherMap에서 받은
            <strong>위도 · 경도</strong>를 이용하여
            Open-Meteo 대기질 API 추가 호출
          </li>

          <li>
            Forecast의 <code>pop</code> 값을
            0~100%의 강수확률로 변환
          </li>

          <li>
            Leaflet의 지도 이벤트와
            Vue의 <code>emit</code>을 연결하여
            마커 선택 → 실제 날씨 조회 구현
          </li>

          <li>
            Pinia Store를 활용한
            <strong>섭씨/화씨 단위 전환</strong> 및
            <strong>한국어/영어 전환</strong>
          </li>

          <li>
            감정 키워드를 날씨에 매핑한
            <strong>나만의 마음 날씨 추천 기능</strong>
          </li>

        </ul>

      </div>


      <!-- ================================================= -->
      <!-- Vue 활용 -->
      <!-- ================================================= -->

      <h4>🧩 Vue 활용</h4>

      <ul>

        <li>
          <code>ref</code>,
          <code>computed</code>,
          <code>watch</code>,
          <code>watchEffect</code>를 활용한
          반응형 상태 관리
        </li>

        <li>
          Props와 Emits를 활용한
          부모 · 자식 컴포넌트 간 데이터 전달
        </li>

        <li>
          Pinia Store를 활용한
          전역 상태 관리
        </li>

        <li>
          <code>/weather/:cityId</code>
          동적 라우팅을 활용한
          지역별 상세 페이지 제공
        </li>

        <li>
          Lazy Loading과 Catch-all Route를 활용한
          화면 전환 및 404 페이지 처리
        </li>

      </ul>


      <!-- ================================================= -->
      <!-- 기술 스택 -->
      <!-- ================================================= -->

      <h4>🛠️ 활용 기술</h4>

      <div class="tech-stack">

        <span>Vue 3</span>
        <span>Vue Router 4</span>
        <span>Pinia</span>
        <span>Axios</span>
        <span>Leaflet</span>
        <span>OpenWeatherMap</span>
        <span>Open-Meteo</span>

      </div>

    </div>


    <!-- ================================================= -->
    <!-- 메인 화면 이동 -->
    <!-- ================================================= -->

    <button
      class="home-btn"
      @click="handleGoHome"
    >
      🌦️ 대시보드 홈으로 이동
    </button>

  </div>
</template>


<style scoped>
.about-container {
  width: 100%;
  margin: 30px auto;
}


/* =====================================================
   서비스 소개 박스
===================================================== */

.description-box {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  line-height: 1.7;
  font-size: 14px;
}

.intro-text {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 15px;
  line-height: 1.8;
}


/* =====================================================
   소제목
===================================================== */

.description-box h4 {
  margin-top: 25px;
  margin-bottom: 10px;
  color: #2c3e50;
  font-size: 16px;
}


/* =====================================================
   목록
===================================================== */

ul {
  padding-left: 22px;
  margin: 10px 0 0 0;
}

li {
  margin-bottom: 12px;
  color: #555;
  line-height: 1.7;
}

li strong {
  color: #2c3e50;
}


/* =====================================================
   직접 구현 기능
===================================================== */

.custom-feature-box {
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.custom-feature-box p {
  margin-top: 0;
}


/* =====================================================
   코드 표시
===================================================== */

code {
  background-color: #ffeaa7;
  padding: 2px 5px;
  border-radius: 4px;
  color: #d63031;
}


/* =====================================================
   기술 스택
===================================================== */

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tech-stack span {
  display: inline-block;
  padding: 6px 10px;
  background-color: #eaf4fb;
  color: #2980b9;
  border-radius: 5px;
  font-size: 13px;
  font-weight: bold;
}


/* =====================================================
   홈 버튼
===================================================== */

.home-btn {
  width: 100%;
  margin-top: 15px;
  padding: 11px;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.home-btn:hover {
  background-color: #2980b9;
}
</style>