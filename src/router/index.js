import {
  createRouter,
  createWebHistory,
} from 'vue-router'


// =====================================================
// Router
// =====================================================

const router = createRouter({

  history:
    createWebHistory(
      import.meta.env.BASE_URL
    ),

  routes: [

    // =================================================
    // 기본 주소
    // =================================================

    {
      path: '/',
      redirect: '/weather',
    },


    // =================================================
    // 날씨 메인
    // Lazy Loading 적용
    // =================================================

    {
      path: '/weather',

      name: 'weather-home',

      component: () =>
        import(
          '../views/WeatherHomeView.vue'
        ),
    },


    // =================================================
    // 지역별 상세 페이지
    // Dynamic Route
    //
    // 예:
    // /weather/city_01
    // =================================================

    {
      path: '/weather/:cityId',

      name: 'weather-detail',

      component: () =>
        import(
          '../views/WeatherDetailView.vue'
        ),
    },


    // =================================================
    // 서비스 소개
    // =================================================

    {
      path: '/about',

      name: 'weather-about',

      component: () =>
        import(
          '../views/WeatherAboutView.vue'
        ),
    },


    // =================================================
    // 트러블슈팅
    // =================================================

    {
      path: '/troubleshooting',

      name: 'troubleshooting',

      component: () =>
        import(
          '../views/TroubleshootingView.vue'
        ),
    },


    // =================================================
    // Catch-all Route
    // 존재하지 않는 모든 주소 처리
    // 반드시 가장 마지막
    // =================================================

    {
      path: '/:pathMatch(.*)*',

      name: 'not-found',

      component: () =>
        import(
          '../views/NotFoundView.vue'
        ),
    },

  ],
})


export default router