<script setup>
import {
  ref,
  computed,
} from 'vue'

import {
  useConfigStore,
} from '@/stores/configStore'


// =====================================================
// Pinia Store
// 기존 한국어 / 영어 설정과 연동
// =====================================================

const configStore =
  useConfigStore()


// =====================================================
// Props
//
// 실제 날씨와 마음 날씨를 비교하기 위해
// WeatherHomeView에서 선택된 도시 데이터를 전달받음
// =====================================================

const props = defineProps({

  actualWeather: {
    type: Object,
    default: null,
  },

})


// =====================================================
// 반응형 상태
// =====================================================

// 사용자가 입력한 기분
const moodText = ref('')

// 분석 결과
const result = ref(null)

// 최근 분석 기록
const history = ref([])


// =====================================================
// 입력 여부
// =====================================================

const canAnalyze = computed(() => {
  return moodText.value.trim().length > 0
})


// =====================================================
// 기분 키워드 사전
//
// 간단한 규칙 기반 감정 분석
// AI API 없이도 동작
// =====================================================

const moodRules = [

  // -----------------------------------------------------
  // 맑음
  // -----------------------------------------------------

  {
    type: 'sunny',

    weatherKo: '맑음',
    weatherEn: 'Sunny',

    icon: '☀️',

    keywords: [
      '행복',
      '좋아',
      '좋다',
      '신나',
      '신남',
      '기뻐',
      '기쁨',
      '설레',
      '설렘',
      '즐거',
      '최고',
      '뿌듯',
      '상쾌',
      'happy',
      'great',
      'excited',
      'good',
    ],

    emotionKo:
      '기쁨 · 설렘',

    emotionEn:
      'Happy · Excited',

    messageKo:
      '오늘의 좋은 에너지를 마음껏 즐겨보세요.',

    messageEn:
      'Enjoy the positive energy you have today.',

    actionKo:
      '좋아하는 음악을 듣거나 좋은 순간을 기록해 보세요.',

    actionEn:
      'Listen to your favorite music or capture this good moment.',
  },


  // -----------------------------------------------------
  // 비
  // -----------------------------------------------------

  {
    type: 'rain',

    weatherKo: '비',
    weatherEn: 'Rainy',

    icon: '🌧️',

    keywords: [
      '슬퍼',
      '슬픔',
      '우울',
      '눈물',
      '외로',
      '속상',
      '허전',
      '울고',
      'sad',
      'lonely',
      'depressed',
    ],

    emotionKo:
      '슬픔 · 외로움',

    emotionEn:
      'Sad · Lonely',

    messageKo:
      '마음에 비가 오는 날에는 스스로를 조금 더 다정하게 대해주세요.',

    messageEn:
      'On rainy days of the heart, be a little kinder to yourself.',

    actionKo:
      '따뜻한 음료를 마시며 좋아하는 음악이나 영상을 즐겨보세요.',

    actionEn:
      'Have a warm drink and enjoy something comforting.',
  },


  // -----------------------------------------------------
  // 천둥
  // -----------------------------------------------------

  {
    type: 'storm',

    weatherKo: '천둥',
    weatherEn: 'Stormy',

    icon: '⛈️',

    keywords: [
      '화나',
      '화남',
      '짜증',
      '열받',
      '분노',
      '억울',
      '빡쳐',
      '스트레스',
      'angry',
      'mad',
      'stress',
    ],

    emotionKo:
      '분노 · 스트레스',

    emotionEn:
      'Angry · Stressed',

    messageKo:
      '마음에 천둥이 치는 날에는 바로 반응하기보다 잠깐 거리를 두어보세요.',

    messageEn:
      'When your mind feels stormy, give yourself some space before reacting.',

    actionKo:
      '물을 한 잔 마시고 잠깐 걷거나 천천히 호흡해 보세요.',

    actionEn:
      'Drink some water, take a short walk, or breathe slowly.',
  },


  // -----------------------------------------------------
  // 흐림
  // -----------------------------------------------------

  {
    type: 'cloudy',

    weatherKo: '흐림',
    weatherEn: 'Cloudy',

    icon: '☁️',

    keywords: [
      '피곤',
      '피로',
      '지쳐',
      '지침',
      '답답',
      '무기력',
      '귀찮',
      '힘들',
      '졸려',
      'tired',
      'exhausted',
    ],

    emotionKo:
      '피로 · 답답함',

    emotionEn:
      'Tired · Frustrated',

    messageKo:
      '조금 천천히 가도 괜찮은 날이에요.',

    messageEn:
      'It is okay to move a little more slowly today.',

    actionKo:
      '잠깐 창문을 열고 10분 정도 쉬어보세요.',

    actionEn:
      'Open a window and give yourself a ten-minute break.',
  },

]


// =====================================================
// 기본 결과
// 특정 키워드가 없는 경우
// =====================================================

const defaultResult = {

  type: 'partly-cloudy',

  weatherKo:
    '구름 조금',

  weatherEn:
    'Partly Cloudy',

  icon:
    '🌤️',

  emotionKo:
    '평온 · 복합적인 감정',

  emotionEn:
    'Calm · Mixed Feelings',

  messageKo:
    '오늘의 마음을 천천히 들여다보는 것만으로도 충분해요.',

  messageEn:
    'Simply noticing how you feel today is enough.',

  actionKo:
    '지금 떠오르는 생각을 짧게 한 줄 적어보세요.',

  actionEn:
    'Write down one thought that is on your mind.',
}


// =====================================================
// 마음 날씨 분석
// =====================================================

const analyzeMood = () => {

  const text =
    moodText.value
      .trim()
      .toLowerCase()


  if (!text) {
    return
  }


  // -----------------------------------------------------
  // 각 감정 규칙별 점수 계산
  // -----------------------------------------------------

  let bestRule = null
  let highestScore = 0


  moodRules.forEach(
    (rule) => {

      let score = 0


      rule.keywords.forEach(
        (keyword) => {

          if (
            text.includes(
              keyword.toLowerCase()
            )
          ) {

            score += 1
          }

        }
      )


      if (
        score > highestScore
      ) {

        highestScore =
          score

        bestRule =
          rule
      }

    }
  )


  // -----------------------------------------------------
  // 결과 결정
  // -----------------------------------------------------

  result.value =
    bestRule
      ? { ...bestRule }
      : { ...defaultResult }


  // -----------------------------------------------------
  // 최근 기록
  // 최대 3개
  // -----------------------------------------------------

  history.value.unshift({

    id:
      Date.now(),

    text:
      moodText.value,

    result:
      result.value,

  })


  if (
    history.value.length > 3
  ) {

    history.value.pop()
  }
}


// =====================================================
// 초기화
// =====================================================

const resetMood = () => {

  moodText.value = ''

  result.value = null
}


// =====================================================
// 표시용 computed
// =====================================================

const displayWeather =
  computed(() => {

    if (!result.value) {
      return ''
    }

    return (
      configStore.language === 'ko'
        ? result.value.weatherKo
        : result.value.weatherEn
    )
  })


const displayEmotion =
  computed(() => {

    if (!result.value) {
      return ''
    }

    return (
      configStore.language === 'ko'
        ? result.value.emotionKo
        : result.value.emotionEn
    )
  })


const displayMessage =
  computed(() => {

    if (!result.value) {
      return ''
    }

    return (
      configStore.language === 'ko'
        ? result.value.messageKo
        : result.value.messageEn
    )
  })


const displayAction =
  computed(() => {

    if (!result.value) {
      return ''
    }

    return (
      configStore.language === 'ko'
        ? result.value.actionKo
        : result.value.actionEn
    )
  })


// =====================================================
// 실제 날씨와 마음 날씨 비교 메시지
// =====================================================

const comparisonMessage =
  computed(() => {

    if (
      !result.value ||
      !props.actualWeather
    ) {

      return ''
    }


    const actual =
      props.actualWeather.status


    const mind =
      result.value.type


    if (
      configStore.language === 'en'
    ) {

      if (
        mind === 'sunny'
      ) {

        return `Your heart feels bright today, regardless of the weather in ${props.actualWeather.name}.`
      }


      if (
        mind === 'rain'
      ) {

        return 'The weather outside and the weather in your heart do not always have to be the same.'
      }


      if (
        mind === 'storm'
      ) {

        return 'Your mind feels stormy today. A quiet moment may help.'
      }


      if (
        mind === 'cloudy'
      ) {

        return 'Your heart may need a little rest today.'
      }


      return 'Take a moment to notice both the weather outside and the weather within.'
    }


    if (
      mind === 'sunny'
    ) {

      return `${props.actualWeather.name}의 실제 날씨와 관계없이 오늘 마음에는 햇살이 비치고 있어요.`
    }


    if (
      mind === 'rain'
    ) {

      return '밖의 날씨와 마음의 날씨는 꼭 같을 필요는 없어요. 오늘은 마음에 우산을 씌워주세요.'
    }


    if (
      mind === 'storm'
    ) {

      return '마음에 천둥이 치는 날이에요. 잠깐 조용한 시간을 가져보세요.'
    }


    if (
      mind === 'cloudy'
    ) {

      return '오늘 마음에는 잠깐의 휴식이 필요한 것 같아요.'
    }


    return '밖의 날씨와 함께 오늘 내 마음의 날씨도 천천히 살펴보세요.'
  })


// =====================================================
// 실제 기온 단위 변환
// =====================================================

const actualTemperature =
  computed(() => {

    if (
      !props.actualWeather
    ) {

      return ''
    }


    const rawTemp =
      props.actualWeather.temp


    if (
      configStore.unit
      === 'fahrenheit'
    ) {

      return Math.round(
        (rawTemp * 9) / 5 + 32
      )
    }


    return rawTemp
  })
</script>


<template>
  <div class="mind-weather">

    <!-- ================================================= -->
    <!-- 제목 -->
    <!-- ================================================= -->

    <div class="mind-header">

      <div>

        <h3>
          💭
          {{
            configStore.language === 'ko'
              ? '오늘의 마음 날씨'
              : 'Weather of My Mind'
          }}
        </h3>

        <p>
          {{
            configStore.language === 'ko'
              ? '오늘의 기분을 자유롭게 적어보세요.'
              : 'Tell me how you feel today.'
          }}
        </p>

      </div>

    </div>


    <!-- ================================================= -->
    <!-- 입력 -->
    <!-- ================================================= -->

    <textarea
      v-model="moodText"

      class="mood-input"

      :placeholder="
        configStore.language === 'ko'
          ? '예: 오늘 조금 피곤하지만 그래도 기분은 괜찮은 것 같아.'
          : 'Example: I feel a little tired today, but I am doing okay.'
      "
      rows="4"
    />


    <!-- ================================================= -->
    <!-- 버튼 -->
    <!-- ================================================= -->

    <div class="button-area">

      <button
        class="analyze-button"

        :disabled="!canAnalyze"

        @click="analyzeMood"
      >

        🔍

        {{
          configStore.language === 'ko'
            ? '마음 날씨 확인하기'
            : 'Check Mind Weather'
        }}

      </button>


      <button
        v-if="result"

        class="reset-button"

        @click="resetMood"
      >

        {{
          configStore.language === 'ko'
            ? '다시 입력'
            : 'Reset'
        }}

      </button>

    </div>


    <!-- ================================================= -->
    <!-- 결과 -->
    <!-- ================================================= -->

    <div
      v-if="result"
      class="result-area"
    >

      <div class="main-result">

        <div class="weather-icon">
          {{ result.icon }}
        </div>


        <div>

          <p class="result-label">
            {{
              configStore.language === 'ko'
                ? '오늘의 마음 날씨'
                : 'Today\'s Mind Weather'
            }}
          </p>

          <h2>
            {{ displayWeather }}
          </h2>

        </div>

      </div>


      <!-- ================================================= -->
      <!-- 감정 상태 -->
      <!-- ================================================= -->

      <div class="result-grid">

        <div class="result-item">

          <span class="result-title">
            ❤️
            {{
              configStore.language === 'ko'
                ? '감정 상태'
                : 'Emotion'
            }}
          </span>

          <strong>
            {{ displayEmotion }}
          </strong>

        </div>


        <div class="result-item">

          <span class="result-title">
            💌
            {{
              configStore.language === 'ko'
                ? '오늘의 한마디'
                : 'Message'
            }}
          </span>

          <strong>
            {{ displayMessage }}
          </strong>

        </div>


        <div class="result-item">

          <span class="result-title">
            🌿
            {{
              configStore.language === 'ko'
                ? '추천 행동'
                : 'Suggestion'
            }}
          </span>

          <strong>
            {{ displayAction }}
          </strong>

        </div>

      </div>


      <!-- ================================================= -->
      <!-- 실제 날씨 VS 마음 날씨 -->
      <!-- ================================================= -->

      <div
        v-if="actualWeather"
        class="comparison-area"
      >

        <h4>
          🌤️
          {{
            configStore.language === 'ko'
              ? '밖의 날씨와 마음의 날씨'
              : 'Outside vs Mind Weather'
          }}
        </h4>


        <div class="comparison-grid">

          <div class="comparison-card">

            <span>
              📍
              {{
                configStore.language === 'ko'
                  ? '실제 날씨'
                  : 'Actual Weather'
              }}
            </span>

            <strong>
              {{ actualWeather.name }}
            </strong>

            <p>
              {{ actualWeather.status }}
            </p>

            <p>
              🌡️
              {{ actualTemperature }}
              {{ configStore.unitSymbol }}
            </p>

          </div>


          <div class="comparison-vs">
            VS
          </div>


          <div class="comparison-card mind">

            <span>
              💭
              {{
                configStore.language === 'ko'
                  ? '마음 날씨'
                  : 'Mind Weather'
              }}
            </span>

            <strong>
              {{ result.icon }}
              {{ displayWeather }}
            </strong>

            <p>
              {{ displayEmotion }}
            </p>

          </div>

        </div>


        <p class="comparison-message">
          {{ comparisonMessage }}
        </p>

      </div>

    </div>


    <!-- ================================================= -->
    <!-- 최근 기록 -->
    <!-- ================================================= -->

    <div
      v-if="history.length > 0"
      class="history-area"
    >

      <h4>
        🕒
        {{
          configStore.language === 'ko'
            ? '최근 마음 날씨'
            : 'Recent Mind Weather'
        }}
      </h4>


      <div
        v-for="item in history"
        :key="item.id"
        class="history-item"
      >

        <span class="history-icon">
          {{ item.result.icon }}
        </span>

        <span class="history-text">
          {{ item.text }}
        </span>

      </div>

    </div>

  </div>
</template>


<style scoped>
.mind-weather {
  width: 100%;

  box-sizing: border-box;
}


/* =====================================================
   Header
===================================================== */

.mind-header h3 {
  margin:
    0 0 6px;

  color:
    #2c3e50;
}

.mind-header p {
  margin:
    0 0 15px;

  color:
    #7f8c8d;

  font-size:
    14px;
}


/* =====================================================
   Input
===================================================== */

.mood-input {
  width: 100%;

  box-sizing:
    border-box;

  padding:
    14px;

  resize:
    vertical;

  border:
    1px solid #ced4da;

  border-radius:
    8px;

  font-family:
    inherit;

  font-size:
    14px;

  line-height:
    1.6;

  outline:
    none;
}

.mood-input:focus {
  border-color:
    #74b9ff;

  box-shadow:
    0 0 0 3px
    rgba(116, 185, 255, 0.15);
}


/* =====================================================
   Buttons
===================================================== */

.button-area {
  display:
    flex;

  gap:
    8px;

  margin-top:
    12px;
}

.analyze-button,
.reset-button {
  padding:
    9px 14px;

  border:
    none;

  border-radius:
    6px;

  cursor:
    pointer;

  font-weight:
    bold;
}

.analyze-button {
  background:
    #4b6584;

  color:
    #ffffff;
}

.analyze-button:hover {
  background:
    #3c536d;
}

.analyze-button:disabled {
  opacity:
    0.4;

  cursor:
    not-allowed;
}

.reset-button {
  background:
    #e9ecef;

  color:
    #495057;
}


/* =====================================================
   Main Result
===================================================== */

.result-area {
  margin-top:
    20px;
}

.main-result {
  display:
    flex;

  align-items:
    center;

  gap:
    18px;

  padding:
    22px;

  background:
    linear-gradient(
      135deg,
      #f7fbfa,
      #eef5f2
    );

  border:
    1px solid #dfe9e5;

  border-radius:
    12px;
}

.weather-icon {
  font-size:
    54px;
}

.result-label {
  margin:
    0;

  color:
    #7f8c8d;

  font-size:
    13px;
}

.main-result h2 {
  margin:
    4px 0 0;

  color:
    #2c3e50;
}


/* =====================================================
   Detail Result
===================================================== */

.result-grid {
  display:
    grid;

  grid-template-columns:
    repeat(
      3,
      1fr
    );

  gap:
    10px;

  margin-top:
    12px;
}

.result-item {
  padding:
    14px;

  background:
    #ffffff;

  border:
    1px solid #e9ecef;

  border-radius:
    8px;
}

.result-title {
  display:
    block;

  margin-bottom:
    8px;

  color:
    #7f8c8d;

  font-size:
    12px;
}

.result-item strong {
  font-size:
    13px;

  line-height:
    1.6;

  color:
    #34495e;
}


/* =====================================================
   Comparison
===================================================== */

.comparison-area {
  margin-top:
    20px;

  padding:
    18px;

  background:
    #f8f9fa;

  border-radius:
    10px;
}

.comparison-area h4 {
  margin-top:
    0;
}

.comparison-grid {
  display:
    grid;

  grid-template-columns:
    1fr auto 1fr;

  align-items:
    center;

  gap:
    12px;
}

.comparison-card {
  padding:
    15px;

  text-align:
    center;

  background:
    #ffffff;

  border:
    1px solid #e4e7ea;

  border-radius:
    8px;
}

.comparison-card span {
  display:
    block;

  margin-bottom:
    8px;

  color:
    #7f8c8d;

  font-size:
    12px;
}

.comparison-card strong {
  display:
    block;

  font-size:
    17px;
}

.comparison-card p {
  margin:
    5px 0;
}

.comparison-card.mind {
  background:
    #f1f8f5;
}

.comparison-vs {
  color:
    #adb5bd;

  font-size:
    12px;

  font-weight:
    bold;
}

.comparison-message {
  margin:
    14px 0 0;

  padding:
    12px;

  text-align:
    center;

  background:
    #ffffff;

  border-radius:
    8px;

  color:
    #495057;

  line-height:
    1.6;
}


/* =====================================================
   History
===================================================== */

.history-area {
  margin-top:
    20px;
}

.history-area h4 {
  margin-bottom:
    10px;
}

.history-item {
  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  padding:
    9px 12px;

  margin-bottom:
    6px;

  background:
    #f8f9fa;

  border-radius:
    6px;
}

.history-icon {
  font-size:
    20px;
}

.history-text {
  overflow:
    hidden;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;

  color:
    #555555;

  font-size:
    13px;
}


/* =====================================================
   Responsive
===================================================== */

@media (
  max-width: 700px
) {

  .result-grid {
    grid-template-columns:
      1fr;
  }

  .comparison-grid {
    grid-template-columns:
      1fr;
  }

  .comparison-vs {
    text-align:
      center;
  }
}
</style>