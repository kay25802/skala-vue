# 🌤️ SKALA Weather

Vue 3를 기반으로 제작한 **실시간 날씨 대시보드 프로젝트**입니다.

OpenWeatherMap과 Open-Meteo API를 활용하여 실제 날씨·예보·대기질 데이터를 제공하며,  
Leaflet 지도, Pinia 전역 상태 관리, Vue Router 등을 적용하여 날씨 정보를 다양한 방식으로 확인할 수 있도록 구현했습니다.

---

## ✨ 주요 기능

### 🌦️ 실시간 날씨 조회
- OpenWeatherMap Current Weather API 연동
- 지역별 기온, 날씨 상태, 습도, 풍속 조회
- 서울, 수원, 부산, 광주 날씨 제공
- 도시 검색 기능

### ☔ 날씨 예보 및 사용자 기준 설정
- OpenWeatherMap Forecast API를 활용한 강수확률 조회
- 사용자가 직접 우산 추천 기준 설정
- 더운 날씨 기준 온도 설정
- 설정값에 따른 날씨 요약 및 외출 정보 제공

### 🌫️ 대기질 정보
- Open-Meteo Air Quality API 추가 연동
- PM10, PM2.5, AQI 정보 제공
- 날씨 API의 위도·경도를 활용하여 대기질 데이터 조회

### 🗺️ 지도 기반 날씨 확인
- Leaflet 외부 UI Library 적용
- 대한민국 지도 및 도시별 마커 표시
- 마커 클릭 시 해당 지역의 실제 날씨 데이터 연동

### 🌡️ 사용자 설정
- Pinia Store를 활용한 전역 상태 관리
- 섭씨(℃) / 화씨(℉) 단위 변경
- 한국어 / 영어 UI 전환
- 설정 변경 시 여러 컴포넌트에 상태 즉시 반영

### 💭 마음 날씨
- 사용자가 입력한 기분을 감정 키워드 기반으로 분석
- 감정에 따라 맑음, 흐림, 비, 천둥 등의 마음 날씨 제공
- 마음 날씨에 따른 메시지 및 추천 행동 제공

### 🔀 Vue Router
- 메인 날씨 대시보드
- 서비스 소개 페이지
- 트러블슈팅 페이지
- `/weather/:cityId` 동적 라우팅을 활용한 지역 상세 페이지
- Catch-all Route를 활용한 404 페이지 처리
- Lazy Loading을 활용한 View 컴포넌트 로딩

---

## 🛠️ 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | Vue 3, JavaScript |
| 상태 관리 | Pinia |
| Routing | Vue Router 4 |
| HTTP 통신 | Axios |
| 지도 | Leaflet |
| 날씨 API | OpenWeatherMap |
| 대기질 API | Open-Meteo |
| Build | Vite |

---

## 🧩 Vue 주요 학습 내용

프로젝트를 통해 다음 Vue 기능을 적용했습니다.

- `ref`를 활용한 반응형 상태 관리
- `computed`를 활용한 파생 데이터 처리
- `watch`, `watchEffect`를 활용한 상태 변화 감지
- Props를 활용한 부모 → 자식 데이터 전달
- Emits를 활용한 자식 → 부모 이벤트 전달
- 컴포넌트 분리를 통한 화면 구성
- Pinia를 활용한 전역 상태 관리
- Vue Router를 활용한 SPA 화면 전환

---

## 📁 주요 프로젝트 구조

```text
src/
├── api/
│   ├── weatherApi.js
│   └── airQualityApi.js
│
├── components/
│   └── exercise/
│       ├── BaseDashboardCard.vue
│       ├── SearchBar.vue
│       ├── WeatherCard.vue
│       ├── WeatherMap.vue
│       └── UnitToggler.vue
│
├── router/
│   └── index.js
│
├── stores/
│   └── configStore.js
│
└── views/
    ├── WeatherHomeView.vue
    ├── WeatherDetailView.vue
    ├── WeatherAboutView.vue
    └── NotFoundView.vue
```

---

## 🔑 환경 변수 설정

OpenWeatherMap API Key는 소스 코드에 직접 작성하지 않고 환경 변수로 관리합니다.

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
VITE_OPENWEATHER_API_KEY=YOUR_API_KEY
```

API Key가 GitHub에 업로드되지 않도록 `.gitignore`에 `.env`를 추가합니다.

```gitignore
.env
.env.local
```

---

## 🚀 실행 방법

### 1. 프로젝트 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. Production Build

```bash
npm run build
```

빌드가 완료되면 `dist/` 폴더에 정적 파일이 생성됩니다.

---

## 🔧 주요 트러블슈팅

개발 과정에서 다음 문제를 해결했습니다.

- OpenWeatherMap API `401 Unauthorized` 인증 오류
- 화면 너비 변경 시 Navigation Bar 요소 잘림 문제
- `window.alert()` 기반 상세보기를 Vue Router 동적 라우팅으로 변경
- Current Weather API와 Forecast API의 강수 데이터 차이 처리
- Leaflet 마커 선택과 실제 날씨 데이터 연동
- Pinia를 활용한 단위 및 언어 상태 동기화

---

## 👩‍💻 프로젝트 정보

**SKALA Vue 최종 과제**

- 광주 2반
- G043
- 김아영