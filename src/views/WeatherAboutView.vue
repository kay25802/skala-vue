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

      <p>
        본 앱은
        <strong>Vue 3</strong> 및
        <strong>Vue Router 4</strong>를 기반으로 제작된
        실습용 기상 관측 대시보드입니다.
      </p>


      <ul>

        <li>
          <code>components/exercise/</code>
          폴더의 컴포넌트를 활용한 화면 구성
        </li>

        <li>
          클라이언트 사이드 라우팅을 통한
          새로고침 없는 화면 전환
        </li>

        <li>
          <code>/weather/:cityId</code>
          동적 라우팅을 활용한 지역별 상세 페이지 제공
        </li>

        <li>
          Lazy Loading을 활용한
          View 컴포넌트 로딩
        </li>

        <li>
          Catch-all Route를 활용한
          존재하지 않는 페이지 처리
        </li>

      </ul>

    </div>


    <!-- ================================================= -->
    <!-- 메인 화면 이동 -->
    <!-- ================================================= -->

    <button
      class="home-btn"
      @click="handleGoHome"
    >
      대시보드 홈으로 이동
    </button>

  </div>
</template>


<style scoped>
.about-container {
  width: 100%;
  margin: 30px auto;
}

.description-box {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  line-height: 1.6;
  font-size: 14px;
}

.description-box p {
  margin-top: 0;
}

ul {
  padding-left: 20px;
  margin: 12px 0 0 0;
}

li {
  margin-bottom: 8px;
  color: #555;
}

code {
  background-color: #ffeaa7;
  padding: 2px 4px;
  border-radius: 4px;
  color: #d63031;
}

.home-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.home-btn:hover {
  background-color: #2980b9;
}
</style>