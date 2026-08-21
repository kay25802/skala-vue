<script setup>
import {
  useRouter,
} from 'vue-router'


// =====================================================
// Router
// =====================================================

const router =
  useRouter()


// =====================================================
// 날씨 메인으로 이동
// =====================================================

const goHome = () => {

  router.push(
    '/weather'
  )
}
</script>


<template>
  <div class="troubleshooting-container">

    <!-- ================================================= -->
    <!-- 제목 -->
    <!-- ================================================= -->

    <h3>
      🛠️ 트러블슈팅
    </h3>

    <p class="intro">
      날씨 대시보드 프로젝트를 구현하면서
      발생했던 주요 문제와 해결 과정을 정리했습니다.
    </p>

    <hr />


    <!-- ================================================= -->
    <!-- Trouble 1 -->
    <!-- OpenWeatherMap 401 -->
    <!-- ================================================= -->

    <section class="trouble-card">

      <h4>
        1. OpenWeatherMap API 401 Unauthorized 오류
      </h4>


      <div class="trouble-section">

        <h5>
          🚨 문제
        </h5>

        <p>
          Axios를 이용해 OpenWeatherMap의
          실제 날씨 데이터를 요청했지만
          다음과 같은 오류가 발생했습니다.
        </p>

        <div class="code-box">
          401 Unauthorized
        </div>

      </div>


      <div class="trouble-section">

        <h5>
          🔍 원인
        </h5>

        <p>
          API 요청 자체는 정상적으로 전달되었지만
          OpenWeatherMap에서 API Key 인증을
          정상적으로 처리하지 못했습니다.
        </p>

        <p>
          또한 Vite 프로젝트에서는
          환경변수 이름이
          <code>VITE_</code>로 시작해야 한다는 점도
          확인할 필요가 있었습니다.
        </p>

      </div>


      <div class="trouble-section">

        <h5>
          ✅ 해결
        </h5>

        <ul>

          <li>
            OpenWeatherMap API Key의
            활성화 상태를 확인했습니다.
          </li>

          <li>
            프로젝트 루트에
            <code>.env</code>
            파일을 생성했습니다.
          </li>

          <li>
            API Key를 다음 형태로 저장했습니다.
          </li>

        </ul>


        <div class="code-box">
          VITE_OPENWEATHER_API_KEY=API_KEY
        </div>


        <ul>

          <li>
            코드에서는
            <code>
              import.meta.env.VITE_OPENWEATHER_API_KEY
            </code>
            로 값을 불러오도록 수정했습니다.
          </li>

          <li>
            환경변수를 적용한 후
            Vite 개발 서버를 재시작했습니다.
          </li>

        </ul>

      </div>


      <div class="result-box">
        💡 결과:
        Axios를 통해 실제 날씨 데이터를
        정상적으로 받아올 수 있는 구조를 구성했습니다.
      </div>

    </section>


    <!-- ================================================= -->
    <!-- Trouble 2 -->
    <!-- Navigation -->
    <!-- ================================================= -->

    <section class="trouble-card">

      <h4>
        2. Navigation Bar 버튼과 텍스트 잘림
      </h4>


      <div class="trouble-section">

        <h5>
          🚨 문제
        </h5>

        <p>
          Pinia를 이용한 온도 단위 변경과
          언어 변경 기능을 Navigation Bar에 추가하면서
          일부 버튼과 텍스트가 잘리거나
          두 줄로 표시되는 문제가 발생했습니다.
        </p>

      </div>


      <div class="trouble-section">

        <h5>
          🔍 원인
        </h5>

        <p>
          컨테이너의 제한된 너비와
          Flex Item의 크기 설정으로 인해
          Navigation Bar 내부 공간이 부족했습니다.
        </p>

      </div>


      <div class="trouble-section">

        <h5>
          ✅ 해결
        </h5>

        <ul>

          <li>
            Navigation Bar에
            <code>display: flex</code>
            를 적용했습니다.
          </li>

          <li>
            메뉴 항목에
            <code>white-space: nowrap</code>
            을 적용했습니다.
          </li>

          <li>
            각 Flex Item의 크기를 조정해
            텍스트가 강제로 줄바꿈되지 않도록 했습니다.
          </li>

          <li>
            화면 크기가 작아지면 설정 영역이
            다음 줄로 이동하도록
            Media Query를 추가했습니다.
          </li>

        </ul>

      </div>


      <div class="result-box">
        💡 결과:
        화면 크기에 따라 자연스럽게 대응하는
        Navigation UI를 구현했습니다.
      </div>

    </section>


    <!-- ================================================= -->
    <!-- Trouble 3 -->
    <!-- Router -->
    <!-- ================================================= -->

    <section class="trouble-card">

      <h4>
        3. 상세보기 기능을 Router 방식으로 전환
      </h4>


      <div class="trouble-section">

        <h5>
          🚨 문제
        </h5>

        <p>
          초기 WeatherCard의 상세보기 버튼은
          <code>window.alert()</code>
          방식으로 구현되어 있어
          별도의 상세 페이지를 제공하지 못했습니다.
        </p>

      </div>


      <div class="trouble-section">

        <h5>
          ✅ 해결
        </h5>

        <p>
          WeatherCard에서 선택한 도시의
          ID를 부모 컴포넌트로 전달하도록
          Emit 구조를 수정했습니다.
        </p>


        <div class="code-box">
          emit('click-detail', cityItem.id)
        </div>


        <p>
          부모 View에서는
          <code>router.push()</code>
          를 이용하여 동적 URL로 이동하도록
          변경했습니다.
        </p>


        <div class="code-box">
          router.push('/weather/' + id)
        </div>


        <p>
          Router에는
          다음과 같은 Dynamic Route를 적용했습니다.
        </p>


        <div class="code-box">
          /weather/:cityId
        </div>

      </div>


      <div class="result-box">
        💡 결과:
        도시별 상세 정보를 별도의 View에서
        확인할 수 있도록 화면 구조를 확장했습니다.
      </div>

    </section>


    <!-- ================================================= -->
    <!-- Trouble 4 -->
    <!-- API 데이터 구조 -->
    <!-- ================================================= -->

    <section class="trouble-card">

      <h4>
        4. 강수량과 강수확률 데이터의 차이
      </h4>


      <div class="trouble-section">

        <h5>
          🚨 문제
        </h5>

        <p>
          기존 Mock Data에서는
          <code>rain</code> 값을
          강수확률(%)로 사용했지만,
          OpenWeatherMap Current Weather API에서
          제공하는 rain 데이터는
          강수확률이 아니라 강수량이라는 차이가 있었습니다.
        </p>

      </div>


      <div class="trouble-section">

        <h5>
          ✅ 해결
        </h5>

        <p>
          OpenWeatherMap의
          5 Day / 3 Hour Forecast API를
          추가로 연동했습니다.
        </p>

        <p>
          Forecast API에서 제공되는
          <code>pop</code>
          값을 이용하여
          실제 강수확률을 계산했습니다.
        </p>


        <div class="code-box">
          Math.round((forecast.pop ?? 0) * 100)
        </div>

      </div>


      <div class="result-box">
        💡 결과:
        기존 우산 추천 기능을
        실제 강수확률 데이터와 연결할 수 있었습니다.
      </div>

    </section>


    <!-- ================================================= -->
    <!-- Trouble 5 -->
    <!-- Leaflet -->
    <!-- ================================================= -->

    <section class="trouble-card">

      <h4>
        5. 지도 UI와 날씨 데이터 연결
      </h4>


      <div class="trouble-section">

        <h5>
          🚨 문제
        </h5>

        <p>
          Leaflet 지도에 도시 Marker를 표시하는 것만으로는
          기존 날씨 기능과 연결되지 않아
          단순한 시각적 요소에 머무르는 문제가 있었습니다.
        </p>

      </div>


      <div class="trouble-section">

        <h5>
          ✅ 해결
        </h5>

        <p>
          지도 Marker 클릭 시
          도시 ID를 부모 View에 전달하도록
          Emit 이벤트를 구현했습니다.
        </p>


        <div class="code-box">
          emit('select-city', city.id)
        </div>


        <p>
          WeatherHomeView에서 전달받은 도시 ID를 이용해
          기존 API 데이터 배열에서
          해당 도시를 검색하도록 구현했습니다.
        </p>


        <div class="code-box">
          weatherList.find(
          item => item.id === cityId
          )
        </div>

      </div>


      <div class="result-box">
        💡 결과:
        지도 Marker 클릭 → 도시 선택 →
        실제 날씨 및 대기질 정보 표시까지
        하나의 사용자 흐름으로 연결했습니다.
      </div>

    </section>


    <!-- ================================================= -->
    <!-- 메인 이동 -->
    <!-- ================================================= -->

    <button
      class="home-button"
      @click="goHome"
    >
      ← 날씨 대시보드로 돌아가기
    </button>

  </div>
</template>


<style scoped>
.troubleshooting-container {
  width: 100%;

  box-sizing: border-box;

  margin: 0 auto;
}


/* =====================================================
   제목
===================================================== */

.troubleshooting-container h3 {
  margin-top: 0;

  margin-bottom: 8px;

  color: #2c3e50;
}

.intro {
  margin-bottom: 20px;

  color: #6c757d;

  line-height: 1.6;
}


/* =====================================================
   Trouble Card
===================================================== */

.trouble-card {
  margin-bottom: 20px;

  padding: 20px;

  background-color: #f8f9fa;

  border:
    1px solid #e9ecef;

  border-radius: 10px;

  box-sizing: border-box;
}

.trouble-card h4 {
  margin-top: 0;

  margin-bottom: 18px;

  color: #2c3e50;

  font-size: 17px;
}


/* =====================================================
   문제 / 원인 / 해결
===================================================== */

.trouble-section {
  margin-bottom: 18px;
}

.trouble-section h5 {
  margin:
    0 0 8px 0;

  font-size: 14px;

  color: #34495e;
}

.trouble-section p {
  margin:
    6px 0;

  line-height: 1.7;

  color: #555555;
}

.trouble-section ul {
  margin:
    8px 0;

  padding-left: 22px;
}

.trouble-section li {
  margin-bottom: 6px;

  line-height: 1.6;

  color: #555555;
}


/* =====================================================
   Inline Code
===================================================== */

code {
  padding:
    2px 5px;

  background-color:
    #eeeeee;

  border-radius:
    4px;

  color:
    #d63031;

  font-family:
    monospace;
}


/* =====================================================
   Code Box
===================================================== */

.code-box {
  margin:
    10px 0;

  padding:
    10px 12px;

  background-color:
    #2f3640;

  color:
    #f5f6fa;

  border-radius:
    6px;

  font-family:
    monospace;

  font-size:
    13px;

  line-height:
    1.6;

  overflow-x:
    auto;

  white-space:
    pre-wrap;
}


/* =====================================================
   결과
===================================================== */

.result-box {
  margin-top: 15px;

  padding:
    12px 14px;

  background-color:
    #e8f5e9;

  border-left:
    4px solid #66bb6a;

  border-radius:
    6px;

  color:
    #2e7d32;

  line-height:
    1.6;

  font-weight:
    500;
}


/* =====================================================
   홈 버튼
===================================================== */

.home-button {
  width: 100%;

  margin-top: 5px;

  padding:
    11px 15px;

  border:
    none;

  border-radius:
    6px;

  background-color:
    #4b6584;

  color:
    #ffffff;

  cursor:
    pointer;

  font-weight:
    bold;

  font-size:
    14px;
}

.home-button:hover {
  background-color:
    #3c536d;
}


/* =====================================================
   작은 화면
===================================================== */

@media (
  max-width: 700px
) {

  .trouble-card {
    padding:
      15px;
  }

  .trouble-card h4 {
    font-size:
      15px;
  }

  .code-box {
    font-size:
      12px;
  }
}
</style>