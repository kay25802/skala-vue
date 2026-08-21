# 🌤️ SKALA Weather

Vue 3 기반으로 제작한 날씨 대시보드 프로젝트입니다.

Vue의 반응형 상태 관리부터 컴포넌트 분리, Vue Router, Pinia, 외부 API, UI Library, 배포까지 단계적으로 적용했습니다.

각 단원에서는 기본 실습 내용을 바탕으로 날씨 기준 설정, 언어 변경, 실제 날씨 API 연동, 대기질 정보, 지도 등 개인 기능을 추가하여 확장했습니다.

---

## 👩‍💻 프로젝트 정보

- 과정: SKALA Vue
- 교육생: 광주 2반 G043 김아영
- Framework: Vue 3 + Vite
- 배포: Vercel

---

# 📝 단원별 개인 추가·변경 내용

## 1. Vue Composition API

### 학습 내용
- `ref`를 활용한 반응형 상태 관리
- `computed`를 활용한 파생 데이터 처리
- `watch`, `watchEffect`를 활용한 상태 변화 감지

### 개인 추가·변경
- 기본 날씨 데이터에 `humidity(습도)`, `rain(강수확률)` 데이터 추가
- 도시 검색 기능 구현
- 우산 추천 강수확률 기준을 사용자가 직접 변경할 수 있도록 구현
- 더운 날씨 판단 기준을 직접 설정할 수 있도록 구현
- 평균 기온, 더운 도시 수, 비가 올 가능성이 높은 도시 수 계산
- 강수확률과 더운 날씨 기준 변경을 감지하는 개인 `watch` 추가

---

## 2. Vue Component

### 학습 내용
- Props
- Emits
- 부모·자식 컴포넌트 간 데이터 전달
- 공통 컴포넌트 분리

### 개인 추가·변경
화면을 다음과 같이 역할별 컴포넌트로 분리했습니다.

- `WeatherParent.vue`: 날씨 데이터 및 전체 상태 관리
- `SearchBar.vue`: 도시 검색
- `WeatherCard.vue`: 지역별 날씨 카드
- `BaseDashboardCard.vue`: 공통 카드 UI

`WeatherCard`에는 추가로 다음 기능을 구현했습니다.

- 습도 상태 표시
- 더움 / 선선함 상태 표시
- 강수확률 기반 우산 추천
- 기온에 따른 외출 추천
- 카드 선택 및 상세보기 이벤트 전달

---

## 3. Vue Router

### 학습 내용
- Vue Router 4
- SPA 방식의 화면 전환
- Dynamic Route
- Lazy Loading
- Catch-all Route

### 개인 추가·변경
- `/weather` : 메인 날씨 대시보드
- `/weather/:cityId` : 지역별 상세 날씨
- `/about` : 서비스 소개
- `/troubleshooting` : 트러블슈팅
- 존재하지 않는 주소를 처리하는 404 페이지 추가
- 기존 `alert()` 방식의 상세보기를 Router 기반 상세 페이지로 변경
- View 컴포넌트에 Lazy Loading 적용

---

## 4. Pinia Store

### 학습 내용
- Pinia를 활용한 전역 상태 관리
- State
- Getter
- Action

### 개인 추가·변경

#### 🌡️ 날씨 단위 변경
`configStore`를 활용하여 날씨 단위를 전역에서 관리하도록 구현했습니다.

- 섭씨(℃) ↔ 화씨(℉) 전환
- Getter를 통한 현재 단위 기호 제공
- Action을 통한 단위 변경
- 날씨 카드의 실제 온도와 기준 온도에 단위 변환 적용

#### 🌐 언어 변경
기본 단위 설정 외에 개인 기능으로 언어 변경 기능을 추가했습니다.

- 한국어 ↔ 영어 전환
- 전역 언어 상태 관리
- 버튼 클릭 시 화면의 주요 텍스트가 선택한 언어에 맞게 변경되도록 구현

---

## 5. Axios & OpenWeatherMap API

### 학습 내용
- Axios를 이용한 HTTP 요청
- 외부 REST API 연동
- 환경변수를 활용한 API Key 관리

### 개인 추가·변경
기존 Mock Data를 실제 날씨 데이터로 변경했습니다.

- OpenWeatherMap Current Weather API 연동
- 실제 기온
- 날씨 상태
- 습도
- 풍속 데이터 제공

또한 Current Weather API의 `rain` 값이 강수확률이 아니라 강수량이라는 점을 확인하여 **5 Day / 3 Hour Forecast API**를 추가로 연동했습니다.

Forecast의 `pop` 데이터를 활용하여 실제 강수확률을 계산하고 기존 우산 추천 기능과 연결했습니다.

---

## 6. 추가 외부 API

### 🌫️ Open-Meteo Air Quality API

OpenWeatherMap 외에 개인적으로 Open-Meteo API를 추가 연동했습니다.

- PM10
- PM2.5
- AQI

날씨 API에서 얻은 지역의 위도·경도를 이용해 해당 지역의 대기질 데이터를 함께 조회하도록 구현했습니다.

별도의 회원가입이나 API Key 없이 사용할 수 있는 Open-Meteo API를 활용하여 애플리케이션 기능을 확장했습니다.

---

## 7. Weather UI Library

### 학습 내용
- 외부 UI Library 적용

### 개인 추가·변경

**Leaflet**을 활용하여 대한민국 지도를 날씨 대시보드에 추가했습니다.

- 대한민국 중심 지도 표시
- 주요 도시 Marker 표시
- 지도 확대 / 축소
- Marker 클릭 이벤트
- Marker와 실제 날씨 데이터 연결

단순히 지도를 표시하는 것에서 끝나지 않고,

```text
지도 Marker 클릭
        ↓
도시 ID 전달
        ↓
WeatherHomeView에서 도시 검색
        ↓
실제 날씨 및 대기질 정보 표시
```

흐름으로 기존 날씨 기능과 지도 UI를 연결했습니다.

---

## 8. 개인 추가 기능

### 💭 마음 날씨

사용자가 자신의 기분을 입력하면 입력된 감정 키워드를 분석하여 현재 마음 상태를 날씨로 표현하는 기능을 추가했습니다.

예를 들어 긍정적인 감정은 맑은 날씨, 우울하거나 힘든 감정은 흐림 또는 비와 같이 표현하여 실제 기상 정보 외에도 사용자와 상호작용할 수 있도록 기능을 확장했습니다.

---

## 9. 트러블슈팅

프로젝트 개발 과정에서 발생한 문제와 해결 과정을 별도의 트러블슈팅 페이지에 정리했습니다.

### ① OpenWeatherMap API 401 Unauthorized

**원인**
- API Key 인증 문제
- Vite 환경변수 설정 확인 필요

**해결**
- `.env`를 통한 API Key 관리
- `VITE_OPENWEATHER_API_KEY` 환경변수 적용

### ② Navigation Bar 버튼 및 텍스트 잘림

**원인**
- 제한된 컨테이너 너비
- Flex Item의 공간 부족

**해결**
- Flex Layout 수정
- `white-space: nowrap` 적용
- 반응형 Media Query 추가

### ③ 상세보기 기능 Router 방식 전환

기존 `window.alert()` 방식을 Vue Router의 Dynamic Route 방식으로 변경했습니다.

```text
/weather/:cityId
```

### ④ 강수량과 강수확률 데이터 차이

Current Weather API 대신 Forecast API의 `pop` 값을 활용하여 실제 강수확률을 적용했습니다.

### ⑤ Leaflet 지도와 날씨 데이터 연결

Marker 클릭 이벤트를 부모 View로 전달하여 실제 날씨 및 대기질 데이터와 연결했습니다.

### ⑥ Vercel 배포 후 새로고침 404

Vue Router의 `createWebHistory()` 사용 시 `/weather`와 같은 경로에서 새로고침하면 Vercel 서버가 해당 경로의 실제 파일을 찾으면서 `404 NOT_FOUND`가 발생했습니다.

프로젝트 루트에 `vercel.json`을 추가하여 모든 요청을 `index.html`로 전달하도록 수정했습니다.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

이를 통해 직접 URL 접근 및 새로고침에서도 Vue Router가 정상적으로 동작하도록 해결했습니다.

---

# 🛠️ 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | Vue 3, JavaScript |
| Build Tool | Vite |
| 상태 관리 | Pinia |
| Routing | Vue Router 4 |
| HTTP | Axios |
| 지도 | Leaflet |
| 날씨 API | OpenWeatherMap |
| 대기질 API | Open-Meteo |
| Deployment | Vercel |

---

# 🔑 환경 변수

OpenWeatherMap API Key는 코드에 직접 작성하지 않고 환경변수로 관리합니다.

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
VITE_OPENWEATHER_API_KEY=YOUR_API_KEY
```

`.env` 파일은 GitHub에 업로드하지 않습니다.

```gitignore
.env
.env.local
```

Vercel 배포 환경에서도 동일한 이름의 Environment Variable을 등록하여 사용합니다.

---

# 🚀 실행 방법

```bash
npm install
npm run dev
```

Production Build:

```bash
npm run build
```

---

# 🌐 Deployment

Vercel을 통해 배포했습니다.

**SKALA Weather**  
https://skala-vue-sigma.vercel.app/weather