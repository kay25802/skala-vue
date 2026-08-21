<script setup>
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <h1>⛅ 최종과제: 광주_2반_G043_김아영</h1>
    <hr />

    <div class="dashboard-wrapper">

      <!-- ============================================== -->
      <!-- Navigation Bar -->
      <!-- ============================================== -->

      <nav class="navigation-bar">

        <RouterLink
          to="/weather"
          class="nav-item"
        >
          🌦️ 날씨 대시보드
        </RouterLink>

        <span class="divider">|</span>

        <RouterLink
          to="/about"
          class="nav-item"
        >
          ℹ️ 서비스 소개
        </RouterLink>


        <!-- ============================================ -->
        <!-- Pinia Store -->
        <!-- 온도 단위 및 언어 설정 -->
        <!-- ============================================ -->

        <UnitToggler />

      </nav>


      <!-- ============================================== -->
      <!-- Router에 따라 View 표시 -->
      <!-- ============================================== -->

      <main>
        <RouterView />
      </main>

    </div>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>